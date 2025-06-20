package net.zorphy.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableMethodSecurity(
        securedEnabled = true
)
@Configuration
public class MethodSecurityConfig {
}
