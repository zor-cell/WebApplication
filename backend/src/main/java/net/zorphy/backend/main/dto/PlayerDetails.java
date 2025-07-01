package net.zorphy.backend.main.dto;

import jakarta.validation.constraints.NotBlank;

public record PlayerDetails(
        @NotBlank
        String name
) {
}
