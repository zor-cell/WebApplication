package net.zorphy.backend.main.dto.game.stats;

public record CorrelationMetadata(
        String title,
        String xAxisTitle,
        String yAxisTitle,
        CorrelationAxisType xAxisType
) {
}
