package net.zorphy.backend.catan.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.catan.dto.data.DiceRoll;
import net.zorphy.backend.catan.dto.data.GameConfig;
import net.zorphy.backend.catan.dto.data.GameState;
import net.zorphy.backend.catan.service.CatanService;
import net.zorphy.backend.main.exception.InvalidSessionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping("/catan")
public class CatanController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final CatanService catanService;

    public CatanController(CatanService catanService) {
        this.catanService = catanService;
    }

    @PostMapping("start")
    public GameState start(HttpSession session, @RequestBody GameConfig gameConfig) {
        LOGGER.info("POST /catan/start");

        if(sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        GameState gameState = catanService.getGameStateFromConfig(gameConfig);
        session.setAttribute("gameState", gameState);

        return gameState;
    }

    @PostMapping("dice-roll")
    public GameState makeDiceRoll(HttpSession session,
                                  @RequestParam(name = "alchemist", required = false, defaultValue = "false") boolean alchemist) {
        LOGGER.info("POST /catan/dice-roll");

        GameState gameState = catanService.rollDice(getGameState(session), alchemist);
        session.setAttribute("gameState", gameState);

        return gameState;
    }

    @GetMapping("dice-rolls")
    public List<DiceRoll> getDiceRolls(HttpSession session) {
        LOGGER.info("POST /catan/dice-rolls");

        return getGameState(session).diceRolls();
    }


    private boolean sessionExists(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute("gameState");
        return gameState != null;
    }

    private GameState getGameState(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute("gameState");
        if(gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }
}
