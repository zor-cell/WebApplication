package net.zorphy.backend.site.all.dto;

import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.player.TeamDetails;

public record ResultTeamState(
        @Valid
        TeamDetails team,
        int score
) {
}
