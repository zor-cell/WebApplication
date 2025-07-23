package net.zorphy.backend.site;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.site.catan.dto.GameConfig;
import net.zorphy.backend.site.catan.dto.GameState;
import net.zorphy.backend.site.catan.dto.ResultState;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

public abstract class GameSessionController<T, R> {
    private final GameSessionService<T, R> sessionService;
    private final String SESSION_KEY;

    public GameSessionController(GameSessionService<T, R> sessionService, String sessionKey) {
        this.sessionService = sessionService;
        this.SESSION_KEY = sessionKey;
    }

    @PostMapping("clear")
    public void clear(HttpSession session) {
        //check for valid session
        getGameState(session);

        session.removeAttribute(SESSION_KEY);
    }

    @GetMapping("state")
    public R getState(HttpSession session) {
        return getGameState(session);
    }

    @PostMapping("start")
    public R createSession(HttpSession session, @Valid @RequestBody T gameConfig) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        R gameState = sessionService.createSession(gameConfig);
        session.setAttribute(SESSION_KEY, gameState);

        return gameState;
    }

    @PutMapping("update")
    public R updateSession(HttpSession session, @Valid @RequestBody T gameConfig) {
        R gameState = sessionService.updateSession(getGameState(session), gameConfig);
        session.setAttribute(SESSION_KEY, gameState);

        return gameState;
    }

    @Secured("ROLE_ADMIN")
    @PostMapping(value = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameDetails saveSession(HttpSession session,
                                @RequestPart("gameState") @Valid ResultState resultState,
                                @RequestPart(value = "image", required = false) MultipartFile image) {
        return sessionService.saveSession(getGameState(session), resultState, image);
    }


    private boolean sessionExists(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(SESSION_KEY);
        return gameState != null;
    }

    private R getGameState(HttpSession session) {
        R gameState = (R) session.getAttribute(SESSION_KEY);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }
}
