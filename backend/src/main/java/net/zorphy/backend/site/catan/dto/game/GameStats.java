package net.zorphy.backend.site.catan.dto.game;

import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;

import java.util.List;

public record GameStats(
        List<Integer> temp
) implements GameSpecificStats {
}
