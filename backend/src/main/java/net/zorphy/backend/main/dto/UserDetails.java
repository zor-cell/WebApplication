package net.zorphy.backend.main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import net.zorphy.backend.main.enums.Role;

import java.util.List;

public record UserDetails(
        @NotBlank
        String username,

        @Null
        List<Role> roles
){

}
