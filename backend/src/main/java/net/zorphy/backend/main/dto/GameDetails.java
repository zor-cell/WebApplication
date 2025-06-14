package net.zorphy.backend.main.dto;

import net.zorphy.backend.main.enums.GameType;

import java.time.LocalDate;
import java.util.List;

public record GameDetails(
        LocalDate playedAt,
        GameType gameType,
        Object gameState,
        List<PlayerDetails> winners,
        List<PlayerDetails> players
) {
}
