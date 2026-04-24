package backend.Module_4.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/bookings/**",
                                "/api/chat/**",
                                "/api/resources/**",
                                "/api/module1/resources/**",
                                "/api/tickets/**",
                                "/api/module4/auth/**",
                                "/api/module4/notifications/**",
                                "/api/module4/users/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:3000/login-success", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:3000")
                );

        return http.build();
    }
}