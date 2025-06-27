package net.zorphy.backend.project.catan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record SaveGameState(
        @NotEmpty
        @Valid
        List<SaveTeamState> teams
) {
}
