package net.zorphy.backend.main.dto;

import jakarta.validation.constraints.NotNull;

public record PlayerDetails(
        @NotNull
        String name
) {
}
