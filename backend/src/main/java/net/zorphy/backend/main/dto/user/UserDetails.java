package net.zorphy.backend.main.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;

import java.util.List;

public record UserDetails(
        @NotBlank
        String username,

        @Null
        List<Role> roles
) {

}
