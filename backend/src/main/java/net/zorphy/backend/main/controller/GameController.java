package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.response.GameDetails;
import net.zorphy.backend.main.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping()
    public List<GameDetails> getGames() {
        return gameService.getGames();
    }

    @PostMapping("/save")
    public GameDetails saveGame(@RequestBody GameDetails gameDetails) {
        return gameService.saveGame(gameDetails);
    }
}
