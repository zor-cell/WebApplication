package net.zorphy.backend.site.catan.dto;

import java.time.LocalDateTime;
import java.util.List;

public record GameState(
        LocalDateTime startTime,
        GameConfig gameConfig,
        int currentPlayerTurn,
        int currentShipTurn,
        List<DicePair> classicCards,
        List<Character> eventCards,
        List<DiceRoll> diceRolls
) {
}
