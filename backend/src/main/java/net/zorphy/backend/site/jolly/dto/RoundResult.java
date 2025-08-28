package net.zorphy.backend.site.jolly.dto;

import net.zorphy.backend.main.dto.player.TeamDetails;

public record RoundResult(
        TeamDetails team,
        int score,
        boolean hasClosed
) {
}
