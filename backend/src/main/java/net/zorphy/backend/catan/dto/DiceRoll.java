package net.zorphy.backend.catan.dto;

import net.zorphy.backend.main.dto.TeamDetails;

import java.util.Objects;

public record DiceRoll(
        DicePair dicePair,
        Character diceEvent,
        String teamName
) {
}
