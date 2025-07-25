package net.zorphy.backend.site.catan.dto.result;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ResultState(
        @NotEmpty
        @Valid
        List<ResultTeamState> teams
) {
}
