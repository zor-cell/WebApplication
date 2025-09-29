package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.site.catan.dto.DiceRoll;

import java.util.List;


public record GameStats(
        int gameCount,
        double luckMetric,
        List<DiceRoll> diceRolls
) implements GameSpecificStats {
}
