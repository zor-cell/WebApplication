package net.zorphy.backend.main.dto.player;

import jakarta.validation.constraints.NotBlank;

public record PlayerDetails(
        @NotBlank
        String name
) {
}
