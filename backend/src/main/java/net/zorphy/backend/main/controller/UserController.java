package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.UserDetails;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.main.service.UserService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Secured({ "ROLE_USER", "ROLE_ADMIN" })
    @GetMapping("/me")
    public UserDetails current(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidSessionException("No authentication info");
        }

        return userService.getCurrentUser(authentication);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/register")
    public UserDetails register(@RequestBody UserDetails userDetails) {
        return userService.registerUser(userDetails);
    }
}
