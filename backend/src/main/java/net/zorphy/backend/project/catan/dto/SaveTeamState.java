package net.zorphy.backend.project.catan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import net.zorphy.backend.main.dto.TeamDetails;

public record SaveTeamState(
        @Valid
        TeamDetails team,

        @Min(0)
        int score
) {
}
