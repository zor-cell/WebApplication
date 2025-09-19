package net.zorphy.backend.main.dto.game;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

public record GameFilters(
        String text,
        Instant dateFrom,
        Instant dateTo,
        Duration minDuration,
        Duration maxDuration,
        List<GameType> gameTypes
) {
}
