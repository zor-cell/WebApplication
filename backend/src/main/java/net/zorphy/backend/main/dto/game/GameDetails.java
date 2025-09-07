package net.zorphy.backend.main.dto.game;

public record GameDetails(
        GameMetadata metadata,
        Object gameState,
        Object result
) {
}
