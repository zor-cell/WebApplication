package net.zorphy.backend.site.all.base.impl;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import net.zorphy.backend.main.dto.player.TeamDetails;

public record ResultTeamState(
        @Valid
        TeamDetails team,

        @Min(0)
        int score
) {
}
