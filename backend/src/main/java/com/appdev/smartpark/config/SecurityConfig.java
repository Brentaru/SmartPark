package com.appdev.smartpark.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Security Configuration for password hashing
 * Uses BCrypt algorithm to securely hash passwords before storing in database
 */
@Configuration
public class SecurityConfig {
    
    /**
     * BCrypt Password Encoder Bean
     * Strength: 10 (default) - good balance between security and performance
     * BCrypt automatically handles:
     * - Salting (random salt per password)
     * - Multiple rounds of hashing
     * - Protection against rainbow table attacks
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
