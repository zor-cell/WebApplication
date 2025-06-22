package net.zorphy.backend.catan.dto;

import net.zorphy.backend.main.dto.TeamDetails;

public record SaveTeamState(
        TeamDetails team,
        int score
) {
}
