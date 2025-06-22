package net.zorphy.backend.catan.dto;

import java.util.List;

public record SaveGameState(
        List<SaveTeamState> teams
) {
}
