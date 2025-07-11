package net.zorphy.backend.site.catan.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.catan.dto.GameConfig;
import net.zorphy.backend.site.catan.dto.GameState;
import net.zorphy.backend.site.catan.dto.ResultState;
import net.zorphy.backend.site.catan.service.CatanService;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/catan")
public class CatanController {
    private final CatanService catanService;
    private static final String sessionKey = "catan_gameState";

    public CatanController(CatanService catanService) {
        this.catanService = catanService;
    }

    @GetMapping("state")
    public GameState getState(HttpSession session) {
        return getGameState(session);
    }

    @GetMapping("dice-rolls")
    public List<DiceRoll> getDiceRolls(HttpSession session) {
        return getGameState(session).diceRolls();
    }

    @PostMapping("clear")
    public void clear(HttpSession session) {
        //check for valid session
        getGameState(session);

        session.removeAttribute(sessionKey);
    }

    @PostMapping("start")
    public GameState start(HttpSession session, @Valid @RequestBody GameConfig gameConfig) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        GameState gameState = catanService.initGameState(gameConfig);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PutMapping("update")
    public GameState updateGame(HttpSession session, @Valid @RequestBody GameConfig gameConfig) {
        GameState gameState = catanService.updateGameState(getGameState(session), gameConfig);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("dice-roll")
    public GameState makeDiceRoll(HttpSession session,
                                  @RequestParam(name = "alchemist", required = false, defaultValue = "false") boolean alchemist) {
        GameState gameState = catanService.rollDice(getGameState(session), alchemist);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @Secured("ROLE_ADMIN")
    @PostMapping(value = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameDetails saveGame(HttpSession session,
                                @RequestPart("gameState") @Valid ResultState resultState,
                                @RequestPart(value = "image", required = false) MultipartFile image) {
        return catanService.saveGame(getGameState(session), resultState, image);
    }


    private boolean sessionExists(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(sessionKey);
        return gameState != null;
    }

    private GameState getGameState(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(sessionKey);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }
}
