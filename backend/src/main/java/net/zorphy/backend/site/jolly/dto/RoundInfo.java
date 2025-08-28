package net.zorphy.backend.site.jolly.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RoundInfo(
        LocalDateTime endTime,
        List<RoundResult> results
) {
}
