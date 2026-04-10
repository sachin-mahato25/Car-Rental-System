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
    // Force delete and recreate admin
    userRepository.findByUsername("admin").ifPresent(user -> {
        userRepository.delete(user);
        System.out.println("🗑️ Deleted old admin user");
    });

    User admin = new User();
    admin.setUsername("admin");
    admin.setPassword(passwordEncoder.encode("admin123"));
    admin.setRole(User.Role.ADMIN);
    userRepository.save(admin);
    System.out.println("✅ Fresh admin created with role: " + User.Role.ADMIN.name());
}
}
