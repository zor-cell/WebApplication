package net.zorphy.backend.main.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDetails(
        @NotBlank
        String username,

        @NotBlank
        String password
) {
}
