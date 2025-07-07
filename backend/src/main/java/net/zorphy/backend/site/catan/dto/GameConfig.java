package net.zorphy.backend.site.catan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import net.zorphy.backend.main.dto.player.TeamDetails;

import java.util.List;

public record GameConfig(
        @NotEmpty
        @Valid
        List<TeamDetails> teams,

        @NotNull
        GameMode gameMode,

        @NotNull
        @Valid
        DiceConfig classicDice,

        @NotNull
        @Valid
        DiceConfig eventDice,

        @NotNull
        @Min(value = 1)
        Integer maxShipTurns
) {

}
