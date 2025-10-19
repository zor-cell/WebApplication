package net.zorphy.backend.main.dto.game.stats;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.Duration;
import java.util.UUID;

public record GameStatsDurationMetrics(
        LinkedGameStats<Duration> min,
        LinkedGameStats<Duration> max,
        Duration avg,
        @JsonIgnore
        Duration total,
        @JsonIgnore
        int count
) {
    public GameStatsDurationMetrics() {
        this(
                new LinkedGameStats<>(null, null),
                new LinkedGameStats<>(null, null),
                null,
                Duration.ZERO,
                0
        );
    }

    public GameStatsDurationMetrics update(UUID gameId, Duration newValue) {
        Duration newTotal = total.plus(newValue);
        int newCount = count + 1;

        return new GameStatsDurationMetrics(
                min.updateMin(gameId, newValue),
                max.updateMax(gameId, newValue),
                newCount == 0 ? null : newTotal.dividedBy(newCount),
                newTotal,
                newCount
        );
    }
}
