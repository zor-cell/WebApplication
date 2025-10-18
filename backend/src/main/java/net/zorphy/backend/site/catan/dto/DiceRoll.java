package net.zorphy.backend.site.catan.dto;

import java.time.Instant;

public record DiceRoll(
        DicePair dicePair,
        Character diceEvent,
        String teamName,
        Instant rollTime
) {
}
