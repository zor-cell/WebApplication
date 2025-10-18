package net.zorphy.backend.site.qwirkle.dto.game;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.site.all.dto.GameConfigBase;

import java.util.List;

public record GameConfig(
        @NotEmpty
        @Valid
        List<TeamDetails> teams,

        @NotNull
        @Min(0)
        Integer playingTeam
) implements GameConfigBase { }
