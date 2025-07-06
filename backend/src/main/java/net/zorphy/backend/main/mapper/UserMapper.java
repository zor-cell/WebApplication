package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.dto.user.UserDetails;
import net.zorphy.backend.main.entity.User;
import net.zorphy.backend.main.dto.user.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class UserMapper {
    @Named("rolesFromAuth")
    public List<Role> rolesFromAuth(Collection<? extends GrantedAuthority> authorities) {
        return authorities
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> {
                    String roleName = auth.replaceFirst("^ROLE_", "");
                    return Role.valueOf(roleName);
                })
                .collect(Collectors.toList());
    }

    @Mapping(source = "authorities", target = "roles", qualifiedByName = "rolesFromAuth")
    public abstract UserDetails authDetailsToUserDetails(org.springframework.security.core.userdetails.UserDetails authDetails);

    public abstract UserDetails userToUserDetails(User user);

    public abstract User userDetailsToUser(UserDetails userDetails);
}
