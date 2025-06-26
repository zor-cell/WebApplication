package net.zorphy.backend.catan.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Null;

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
