package backend.Module_4.controller;

import backend.Module_4.model.AppUser;
import backend.Module_4.model.Role;
import backend.Module_4.repository.AppUserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/module4/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AppUserRepository appUserRepository;

    public AuthController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/me")
    public AppUser getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return null;
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        return appUserRepository.findByEmail(email)
                .orElseGet(() -> appUserRepository.save(
                        new AppUser(name, email, Role.USER)
                ));
    }
}