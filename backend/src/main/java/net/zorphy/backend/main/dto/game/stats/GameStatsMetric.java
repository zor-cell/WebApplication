package net.zorphy.backend.main.dto.game.stats;

public record GameStatsMetric<T extends Comparable<T>>(
        LinkedGameStats<T> min,
        LinkedGameStats<T> max,
        T avg
) {
}
