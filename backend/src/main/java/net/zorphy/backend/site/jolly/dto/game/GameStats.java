package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.game.stats.LinkedGameStats;

import java.time.Duration;

public record GameStats(
        int roundsPlayed,
        double roundWinRate,
        LinkedGameStats<Integer> minRoundScore,
        LinkedGameStats<Integer> maxRoundScore,
        double avgRoundScore,
        LinkedGameStats<Duration> minRoundDuration,
        LinkedGameStats<Duration> maxRoundDuration,
        Duration avgRoundDuration,
        double outInOneRate,
        double closedRate
) implements GameSpecificStats {
}
