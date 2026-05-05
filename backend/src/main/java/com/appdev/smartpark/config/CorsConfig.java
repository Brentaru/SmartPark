package com.appdev.smartpark.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration for allowing frontend requests
 * Enables cross-origin requests from React frontend (localhost:3000)
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        for (String origin : allowedOrigins.split(",")) {
            String trimmedOrigin = origin.trim();
            if (!trimmedOrigin.isEmpty()) {
                config.addAllowedOriginPattern(trimmedOrigin);
            }
        }
        
        // Allow all standard HTTP methods including PATCH
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // How long the preflight response can be cached
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
