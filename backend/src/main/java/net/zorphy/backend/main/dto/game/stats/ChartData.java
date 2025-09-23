package net.zorphy.backend.main.dto.game.stats;

import java.util.List;

public record ChartData<X, Y>(
        List<ChartDataEntry<X, Y>> entries
) {
}
