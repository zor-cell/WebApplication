package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.dto.game.stats.GameStats;
import net.zorphy.backend.main.service.GameService;
import org.springframework.security.access.annotation.Secured;
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

    @GetMapping("/stats")
    public List<GameStats> getStats(@ModelAttribute GameFilters gameFilters) {
        return gameService.getStats(gameFilters);
    }

    @GetMapping("/{id}")
    public GameDetails getGame(@PathVariable UUID id) {
        return gameService.getGame(id);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public GameDetails deleteGame(@PathVariable UUID id) {
        return gameService.deleteGame(id);
    }
}
