package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.player.TeamDetails;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

public interface GameService {
    List<GameMetadata> getGames();

    List<GameMetadata> searchGames(GameFilters  gameFilters);

    GameDetails getGame(UUID id);

    GameDetails deleteGame(UUID id);

    GameDetails saveGame(Duration duration, GameType gameType, Object gameState, Object resultState, MultipartFile image, List<TeamDetails> teams);
}
