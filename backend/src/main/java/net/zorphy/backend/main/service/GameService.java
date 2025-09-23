package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.*;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.all.base.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface GameService {
    List<GameMetadata> getGames();

    List<GameMetadata> searchGames(GameFilters  gameFilters);

    List<GameStats> getStats(GameFilters gameFilters);

    GameDetails getGame(UUID id);

    GameDetails deleteGame(UUID id);

    GameDetails saveGame(GameType gameType, GameStateBase gameState, ResultStateBase resultState, MultipartFile image, List<TeamDetails> teams);
}
