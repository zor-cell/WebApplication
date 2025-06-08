package net.zorphy.backend.catan.dto.data;

public record DiceRoll(
        DicePair dicePair,
        int diceEvent
) {
}
