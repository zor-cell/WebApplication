package net.zorphy.backend.catan.dto.data;

import java.util.List;

public record GameConfig(
        List<String> players,
        DiceConfig classicDice,
        DiceConfig eventDice,
        int maxShipTurns
) {

}
