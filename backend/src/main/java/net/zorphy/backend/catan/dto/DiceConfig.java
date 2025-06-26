package net.zorphy.backend.catan.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DiceConfig(
        @NotNull
        boolean isBalanced,

        @Min(0)
        @Max(36)
        int shuffleThreshold,

        @NotNull
        boolean useEvents
) {
}
