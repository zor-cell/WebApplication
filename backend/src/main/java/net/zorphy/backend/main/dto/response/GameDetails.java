package net.zorphy.backend.main.dto.response;

import net.zorphy.backend.main.enums.GameType;

import java.util.List;

public record GameDetails(
        GameType gameType,
        Object gameState,
        PlayerDetails winner,
        List<PlayerDetails> players
) {
}
