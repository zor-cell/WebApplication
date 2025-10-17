package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.util.List;


public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        double winRate,
        LinkedGameStats<Integer> minScore,
        double avgScore,
        LinkedGameStats<Integer> maxScore,
        LinkedGameStats<Duration> minDuration,
        Duration avgDuration,
        LinkedGameStats<Duration> maxDuration,
        PlayerDetails nemesis,
        PlayerDetails victim,
        PlayerDetails rival,
        PlayerDetails companion,
        List<CorrelationResult> correlations,
        GameSpecificStats gameSpecific
) {
}
