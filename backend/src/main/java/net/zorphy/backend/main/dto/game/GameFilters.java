package net.zorphy.backend.main.dto.game;

import java.time.Duration;
import java.time.Instant;

public record GameFilters(
        String text,
        Instant dateFrom,
        Instant dateTo,
        Duration minDuration,
        Duration maxDuration,
        String gameType
) {
}
