package net.zorphy.backend.project.catan.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DiceConfig(
        @NotNull
        Boolean isBalanced,

        @NotNull
        @Min(0)
        @Max(36)
        Integer shuffleThreshold,

        @NotNull
        Boolean useEvents
) {
}
