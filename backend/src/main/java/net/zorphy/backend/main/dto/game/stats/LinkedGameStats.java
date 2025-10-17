package net.zorphy.backend.main.dto.game.stats;

import java.util.UUID;

public record LinkedGameStats<T>(
        UUID gameId,
        T value
) {
}
