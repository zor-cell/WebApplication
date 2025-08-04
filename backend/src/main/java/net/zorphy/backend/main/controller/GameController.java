package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/search")
    public List<GameMetadata> searchGames(@ModelAttribute GameFilters gameFilters) {
        return gameService.searchGames(gameFilters);
    }

    @GetMapping("/{id}")
    public GameDetails getGame(@PathVariable UUID id) {
        return gameService.getGame(id);
    }
}
