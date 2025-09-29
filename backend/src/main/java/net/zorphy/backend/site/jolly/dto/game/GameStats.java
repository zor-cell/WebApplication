package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;

public record GameStats(
        int roundsPlayed,
        double avgRoundScore,
        int maxRoundScore,
        double outInOneRate,
        double closedRate
) implements GameSpecificStats {
}
