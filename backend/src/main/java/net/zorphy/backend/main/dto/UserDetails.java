package net.zorphy.backend.main.dto;

import net.zorphy.backend.main.enums.Role;

import java.util.List;

public record UserDetails(
        String username,
        List<Role> roles
){

}
