package net.zorphy.backend.main.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDetails(
        @NotBlank
        String username,

        @NotBlank
        String password
) {
}
