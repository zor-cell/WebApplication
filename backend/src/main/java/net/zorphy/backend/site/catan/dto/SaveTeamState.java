package net.zorphy.backend.site.catan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import net.zorphy.backend.main.dto.player.TeamDetails;

public record SaveTeamState(
        @Valid
        TeamDetails team,

        @Min(0)
        int score
) {
}
