package net.zorphy.backend.main.dto.game.stats.metrics;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.UUID;

public record GameStatsNumberMetrics<T extends Number & Comparable<T>>(
        LinkedGameStats<T> min,
        LinkedGameStats<T> max,
        Double avg,
        @JsonIgnore
        double total,
        @JsonIgnore
        int count
) {
    public GameStatsNumberMetrics() {
        this(
          new LinkedGameStats<>(null, null),
          new LinkedGameStats<>(null, null),
          null,
          0,
          0
        );
    }

    public GameStatsNumberMetrics<T> update(UUID gameId, T newValue) {
        double newTotal = total + newValue.doubleValue();
        int newCount = count + 1;

        return new GameStatsNumberMetrics<>(
                min.updateMin(gameId, newValue),
                max.updateMax(gameId, newValue),
                newCount == 0 ? null : newTotal / newCount,
                newTotal,
                newCount
        );
    }
}
