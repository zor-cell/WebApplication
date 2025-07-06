package net.zorphy.backend.project.catan.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
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
