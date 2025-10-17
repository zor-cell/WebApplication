package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.game.stats.LinkedGameStats;

import java.time.Duration;

public record GameStats(
        int roundsPlayed,
        double roundWinRate,
        LinkedGameStats<Integer> minRoundScore,
        double avgRoundScore,
        LinkedGameStats<Integer> maxRoundScore,
        LinkedGameStats<Duration> minRoundDuration,
        Duration avgRoundDuration,
        LinkedGameStats<Duration> maxRoundDuration,
        double outInOneRate,
        double closedRate
) implements GameSpecificStats {
}
