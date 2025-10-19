package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.game.stats.GameStatsDurationMetrics;
import net.zorphy.backend.main.dto.game.stats.GameStatsNumberMetrics;


public record GameStats(
        int roundsPlayed,
        double roundWinRate,
        GameStatsNumberMetrics<Integer> roundScoreMetrics,
        GameStatsDurationMetrics roundDurationMetrics,
        double outInOneRate,
        double closedRate
) implements GameSpecificStats {
}
