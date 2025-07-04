package net.zorphy.backend.project.catan.dto;

import java.util.List;

public record GameState(
        GameConfig gameConfig,
        int currentPlayerTurn,
        int currentShipTurn,
        List<DicePair> classicCards,
        List<Character> eventCards,
        List<DiceRoll> diceRolls
) {
}
