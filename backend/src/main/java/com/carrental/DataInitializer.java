package com.carrental;

import com.carrental.model.User;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin / admin123");
        } else {
            // Make sure existing admin has ADMIN role
            userRepository.findByUsername("admin").ifPresent(user -> {
                user.setRole(User.Role.ADMIN);
                user.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(user);
                System.out.println("✅ Admin user updated with correct role and password.");
            });
        }
    }
}
