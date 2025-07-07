package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping()
    public List<GameMetadata> getGames() {
        return gameService.getGames();
    }

    /*
    @PostMapping("/save")
    public GameDetails saveGame(@RequestBody GameDetails gameDetails) {
        LOGGER.info("GET /games/save");

        return gameService.saveGame(gameDetails);
    }*/
}
