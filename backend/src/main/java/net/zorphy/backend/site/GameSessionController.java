package net.zorphy.backend.site;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.dto.result.ResultState;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

public abstract class GameSessionController<Config extends GameConfigBase, State extends GameStateBase> {
    private final GameSessionService<Config, State> sessionService;
    private final String SESSION_KEY;

    public GameSessionController(GameSessionService<Config, State> sessionService, GameType gameType) {
        this.sessionService = sessionService;
        this.SESSION_KEY = gameType.toString() + "_sessionState";
    }

    @GetMapping("session")
    public State getSession(HttpSession session) {
        return getSessionState(session);
    }

    @PostMapping("session")
    public State createSession(HttpSession session, @Valid @RequestBody Config gameConfig) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        State gameState = sessionService.createSession(gameConfig);
        setSessionState(session, gameState);

        return gameState;
    }

    @PutMapping("session")
    public State updateSession(HttpSession session, @Valid @RequestBody Config gameConfig) {
        State gameState = sessionService.updateSession(getSessionState(session), gameConfig);
        setSessionState(session, gameState);

        return gameState;
    }

    @DeleteMapping("session")
    public void clear(HttpSession session) {
        //check for valid session
        getSessionState(session);

        session.removeAttribute(SESSION_KEY);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping(value = "session/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameDetails saveSession(HttpSession session,
                                @RequestPart("gameState") @Valid ResultState resultState,
                                @RequestPart(value = "image", required = false) MultipartFile image) {
        return sessionService.saveSession(getSessionState(session), resultState, image);
    }

    public State getSessionState(HttpSession session) {
        State gameState = (State) session.getAttribute(SESSION_KEY);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }

    public void setSessionState(HttpSession session, State state) {
        session.setAttribute(SESSION_KEY, state);
    }

    private boolean sessionExists(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(SESSION_KEY);
        return gameState != null;
    }
}
