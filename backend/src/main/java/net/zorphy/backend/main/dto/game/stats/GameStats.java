package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.util.List;


public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        double winRate,
        LinkedGameStats<Integer> minScore,
        LinkedGameStats<Integer> maxScore,
        double avgScore,
        LinkedGameStats<Duration> minDuration,
        LinkedGameStats<Duration> maxDuration,
        Duration avgDuration,
        PlayerDetails nemesis,
        PlayerDetails victim,
        PlayerDetails rival,
        PlayerDetails companion,
        List<CorrelationResult> correlations,
        GameSpecificStats gameSpecific
) {
}
