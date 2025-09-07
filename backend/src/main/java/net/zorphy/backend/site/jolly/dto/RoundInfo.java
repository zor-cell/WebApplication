package net.zorphy.backend.site.jolly.dto;

import java.time.Instant;
import java.util.List;

public record RoundInfo(
        Instant endTime,
        String imageUrl,
        List<RoundResult> results
) {
}
