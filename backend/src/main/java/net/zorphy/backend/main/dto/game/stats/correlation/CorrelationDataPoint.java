package net.zorphy.backend.main.dto.game.stats.correlation;

public record CorrelationDataPoint(
        double x,
        double y,
        boolean isWinner
) {
}
