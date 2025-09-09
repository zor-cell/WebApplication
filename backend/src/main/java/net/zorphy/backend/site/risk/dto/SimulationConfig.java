package net.zorphy.backend.site.risk.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SimulationConfig(
        @NotNull
        @Min(1)
        Integer attackers,

        @NotNull
        @Min(1)
        Integer defenders,

        @NotNull
        @Min(1)
        @Max(10_000_000)
        Integer runs
) {
}
