package net.zorphy.backend.main.dto.game.stats;

import java.util.List;

public record CorrelationResult(
        double coefficient,
        double slope,
        double intercept,
        List<CorrelationDataPoint> points
) {
}
