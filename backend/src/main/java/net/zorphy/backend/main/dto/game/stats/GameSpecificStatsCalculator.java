package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.entity.Game;

import java.util.List;
import java.util.UUID;

public interface GameSpecificStatsCalculator {
    GameType supportedType();

    GameSpecificStats compute(UUID playerId, List<Game> games);
}
