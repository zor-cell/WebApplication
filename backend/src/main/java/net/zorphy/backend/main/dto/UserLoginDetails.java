package net.zorphy.backend.main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserLoginDetails(
        @NotBlank
        String username,

        @NotBlank
        String password
) {
}
