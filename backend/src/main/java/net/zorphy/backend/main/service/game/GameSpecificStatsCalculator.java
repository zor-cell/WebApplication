package net.zorphy.backend.main.service.game;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.CorrelationResult;
import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.entity.Game;

import java.util.List;

public interface GameSpecificStatsCalculator {
    GameType supportedType();

    GameSpecificStats compute(PlayerDetails currentPlayer, List<Game> games, List<CorrelationResult> correlations);
}
