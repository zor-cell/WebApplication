package net.zorphy.backend.main.dto.game.stats.metrics;

public record GameStatsMetrics<T extends Comparable<T>>(
        LinkedGameStats<T> min,
        LinkedGameStats<T> max,
        T avg,
        T median
) {
}
