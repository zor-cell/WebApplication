package net.zorphy.backend.main.dto.game;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.LocalDate;
import java.util.List;

public record GameDetails(
        LocalDate playedAt,
        GameType gameType,
        Object gameState,
        Object result,
        List<PlayerDetails> players
) {
}
