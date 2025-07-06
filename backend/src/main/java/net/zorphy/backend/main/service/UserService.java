package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.user.UserDetails;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserDetails getCurrentUser(Authentication authentication);

    UserDetails registerUser(UserDetails userDetails);
}
