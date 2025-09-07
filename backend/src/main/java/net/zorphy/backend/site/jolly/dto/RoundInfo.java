package net.zorphy.backend.site.jolly.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RoundInfo(
        LocalDateTime endTime,
        String imageUrl,
        List<RoundResult> results
) {
}
