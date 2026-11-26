package com.pgfinder.auth_service.service;

import com.pgfinder.auth_service.dto.AuthResponse;
import com.pgfinder.auth_service.dto.LoginRequest;
import com.pgfinder.auth_service.dto.RegisterRequest;
import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    // Register new user
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Public registration can only create USER or OWNER accounts — never ADMIN.
        user.setRole("OWNER".equalsIgnoreCase(request.getRole()) ? "OWNER" : "USER");

        return userRepository.save(user);
    }

    // Login existing user and generate JWT
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(
                user.getId(),
                user.getName(),
                token,
                user.getEmail(),
                user.getRole()
        );
    }

    public User updateProfile(Long id, String name, String email) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String trimmedName = name == null ? "" : name.trim();
        String trimmedEmail = email == null ? "" : email.trim();

        if (trimmedName.isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (trimmedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (!trimmedEmail.equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(trimmedEmail)) {
            throw new RuntimeException("Email already registered");
        }

        user.setName(trimmedName);
        user.setEmail(trimmedEmail);

        return userRepository.save(user);
    }

    public void changePassword(
            Long id,
            String currentPassword,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    public void forgotPassword(String email) {

        // Unknown email માટે કોઈ action નહીં, જેથી registered emails
        // જાણી શકાય નહીં.
        userRepository.findByEmail(email).ifPresent(user -> {

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setResetTokenExpiry(
                    LocalDateTime.now().plusMinutes(30));

            userRepository.save(user);

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    token);
        });
    }

    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() ->
                        new RuntimeException("Invalid or expired reset link"));

        if (user.getResetTokenExpiry() == null
                || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset link");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}