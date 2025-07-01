package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.UserDetails;
import net.zorphy.backend.main.entity.User;
import net.zorphy.backend.main.mapper.UserMapper;
import net.zorphy.backend.main.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserServiceImpl implements UserDetailsService, UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Override
    public UserDetails getCurrentUser(Authentication authentication) {
        org.springframework.security.core.userdetails.UserDetails userDetails =
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

        return userMapper.authDetailsToUserDetails(userDetails);
    }

    @Override
    public UserDetails registerUser(UserDetails userDetails) {
        User toSave = userMapper.userDetailsToUser(userDetails);
        User saved = userRepository.save(toSave);

        return userMapper.userToUserDetails(saved);
    }
}
