package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.game.stats.LinkedGameStats;
import net.zorphy.backend.site.catan.dto.DiceRoll;

import java.time.Duration;
import java.util.List;


public record GameStats(
        int gameCount,
        double luckMetric,
        LinkedGameStats<Duration> minRollDuration,
        LinkedGameStats<Duration> maxRollDuration,
        Duration avgRollDuration,
        List<DiceRoll> diceRolls
) implements GameSpecificStats {
}
