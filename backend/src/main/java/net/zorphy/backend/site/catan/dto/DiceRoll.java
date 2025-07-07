package net.zorphy.backend.site.catan.dto;

public record DiceRoll(
        DicePair dicePair,
        Character diceEvent,
        String teamName
) {
}
