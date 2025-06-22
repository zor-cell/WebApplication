package net.zorphy.backend.catan.dto;

import net.zorphy.backend.main.dto.TeamDetails;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        GameMode gameMode,
        DiceConfig classicDice,
        DiceConfig eventDice,
        int maxShipTurns
) {

}
