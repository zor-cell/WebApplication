package net.zorphy.backend.main.dto.game;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record GameDetails(
        UUID id,
        LocalDate playedAt,
        Duration duration,
        GameType gameType,
        Object gameState,
        Object result,
        List<PlayerDetails> players
) {
}
