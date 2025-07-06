package net.zorphy.backend.main.dto.player;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record PlayerDetails(
        UUID id,
        @NotBlank
        String name
) {
}
