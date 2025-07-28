package net.zorphy.backend.site.all.base.impl;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import net.zorphy.backend.site.all.base.ResultStateBase;

import java.util.List;

public record ResultState(
        @NotEmpty
        @Valid
        List<ResultTeamState> teams
) implements ResultStateBase {
}
