package edu.cit.btts.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final JwtRequestFilter jwtRequestFilter;

  public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtRequestFilter jwtRequestFilter) {
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    this.jwtRequestFilter = jwtRequestFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
      .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
      .authorizeHttpRequests(authorize -> authorize
        .requestMatchers("/api/auth/google").permitAll() // Allow Google login endpoint without authentication
        // .requestMatchers("/api/public/**").permitAll() // Example: Public endpoints
        // Define role-based access for other endpoints
        // Example: Only TRANSIT_ADMIN can access /api/admin/**
        .requestMatchers("/api/admin/**").hasRole("TRANSIT_ADMIN")
        // Example: TICKET_STAFF and TRANSIT_ADMIN can access /api/ticket-staff/**
        .requestMatchers("/api/ticket-staff/**").hasRole("TICKET_STAFF")
        // Example: Only PASSENGER can access /api/passenger/**
        .requestMatchers("/api/passenger/**").hasRole("PASSENGER")
        .anyRequest().authenticated() // All other requests require authentication
    )
      .exceptionHandling(exception -> exception
        .authenticationEntryPoint(jwtAuthenticationEntryPoint) // Handle authentication errors
      )
      .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Use stateless sessions (JWT)
      );

    // Add a filter to validate the tokens with every request
    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsFilter corsFilter() {
    return new CorsFilter(corsConfigurationSource());
  }

  @Bean
  public UrlBasedCorsConfigurationSource corsConfigurationSource() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    // Replace with your frontend URL(s)
    config.setAllowedOriginPatterns(Collections.singletonList("http://localhost:5173"));
    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}