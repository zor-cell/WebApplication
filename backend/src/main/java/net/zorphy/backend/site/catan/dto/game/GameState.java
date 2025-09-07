package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.catan.dto.DicePair;
import net.zorphy.backend.site.catan.dto.DiceRoll;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public record GameState(
        Instant startTime,
        GameConfig gameConfig,
        int currentPlayerTurn,
        int currentShipTurn,
        List<DicePair> classicCards,
        List<Character> eventCards,
        List<DiceRoll> diceRolls
) implements GameStateBase {
}
