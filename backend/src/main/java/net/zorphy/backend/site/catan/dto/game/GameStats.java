package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.main.dto.game.stats.ChartData;
import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;


public record GameStats(
        ChartData<Integer, Integer> diceRolls
) implements GameSpecificStats {
}
