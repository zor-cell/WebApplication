package net.zorphy.backend.main.dto.game.stats;

public record ChartDataEntry<X, Y>(
        X dimension,
        Y measure
) {
}
