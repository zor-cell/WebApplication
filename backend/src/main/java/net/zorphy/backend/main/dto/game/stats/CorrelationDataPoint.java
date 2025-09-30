package net.zorphy.backend.main.dto.game.stats;

public record CorrelationDataPoint(
        double x,
        double y,
        boolean isWinner
) {
}
