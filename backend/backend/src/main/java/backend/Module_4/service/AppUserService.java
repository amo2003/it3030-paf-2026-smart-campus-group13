package backend.Module_4.service;

import backend.Module_4.model.AppUser;
import backend.Module_4.model.Role;
import backend.Module_4.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    public AppUser createUser(AppUser user) {
        return appUserRepository.save(user);
    }

    public AppUser updateUserRole(Long id, Role role) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setRole(role);
        return appUserRepository.save(user);
    }
}