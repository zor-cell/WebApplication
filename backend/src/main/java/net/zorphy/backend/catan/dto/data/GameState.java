package net.zorphy.backend.catan.dto.data;

import java.util.List;

public record GameState(
        GameConfig gameConfig,
        List<DicePair> classicCards,
        List<Character> eventCards,
        List<DiceRoll> diceRolls
) {

}
