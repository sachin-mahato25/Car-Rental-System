package com.carrental.controller;

import com.carrental.dto.AuthResponse;
import com.carrental.dto.LoginRequest;
import com.carrental.dto.RegisterRequest;
import com.carrental.model.Customer;
import com.carrental.model.User;
import com.carrental.repository.CustomerRepository;
import com.carrental.repository.UserRepository;
import com.carrental.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository        userRepository;
    @Autowired private CustomerRepository    customerRepository;
    @Autowired private PasswordEncoder       encoder;
    @Autowired private JwtUtils              jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User dbUser = userRepository.findByUsername(req.getUsername()).orElse(null);
        if (dbUser == null || !dbUser.getRole().equals(req.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Invalid credentials or role mismatch."));
        }

        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtils.generateToken(auth);

        Customer customer = customerRepository.findByUser_UserId(dbUser.getUserId()).orElse(null);
        String fullName = (customer != null) ? customer.getFullName() : dbUser.getUsername();
        Long customerId = (customer != null) ? customer.getCustomerId() : null;

        return ResponseEntity.ok(new AuthResponse(
            token, dbUser.getUsername(), dbUser.getRole().name(),
            dbUser.getUserId(), customerId, fullName
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Username already taken."));
        }

        User user = User.builder()
            .username(req.getUsername())
            .password(encoder.encode(req.getPassword()))
            .role(User.Role.CUSTOMER)
            .build();
        user = userRepository.save(user);

        Customer customer = Customer.builder()
            .user(user)
            .fullName(req.getFullName())
            .email(req.getEmail())
            .phone(req.getPhone())
            .address(req.getAddress())
            .licenseNo(req.getLicenseNo())
            .build();
        customer = customerRepository.save(customer);

        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(
            token, user.getUsername(), "CUSTOMER",
            user.getUserId(), customer.getCustomerId(), customer.getFullName()
        ));
    }

    static class MessageResponse {
        public String message;
        public MessageResponse(String m) { this.message = m; }
        public String getMessage() { return message; }
    }
}
