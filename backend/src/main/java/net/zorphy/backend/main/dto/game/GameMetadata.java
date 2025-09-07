package net.zorphy.backend.main.dto.game;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameMetadata(
        UUID id,
        Instant playedAt,
        Duration duration,
        GameType gameType,
        String imageUrl,
        List<PlayerDetails> players
) {
}
