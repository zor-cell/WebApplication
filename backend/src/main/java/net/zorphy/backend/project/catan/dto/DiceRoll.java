package net.zorphy.backend.project.catan.dto;

public record DiceRoll(
        DicePair dicePair,
        Character diceEvent,
        String teamName
) {
}
