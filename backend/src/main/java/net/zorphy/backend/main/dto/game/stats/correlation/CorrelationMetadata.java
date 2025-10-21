package net.zorphy.backend.main.dto.game.stats.correlation;

public record CorrelationMetadata(
        String title,
        String xAxisTitle,
        String yAxisTitle,
        CorrelationAxisType xAxisType
) {
}
