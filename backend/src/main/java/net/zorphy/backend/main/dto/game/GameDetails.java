package net.zorphy.backend.main.dto.game;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record GameDetails(
        GameMetadata metadata,
        Object gameState,
        Object result
) {
}
