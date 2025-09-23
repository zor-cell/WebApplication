package net.zorphy.backend.main.dto.game.stats;

public record GameStatsCorrelation<T>(
        T dimension,
        double correlation
) {
}
