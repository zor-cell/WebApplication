package net.zorphy.backend.main.dto.game;

import java.time.Duration;
import java.time.LocalDateTime;

public record GameFilters(
        LocalDateTime dateFrom,
        LocalDateTime dateTo,
        Duration minDuration,
        Duration maxDuration,
        String gameType
) {
}
