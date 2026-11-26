package com.pgfinder.auth_service.service;

import com.pgfinder.auth_service.dto.LoginRequest;
import com.pgfinder.auth_service.dto.RegisterRequest;
import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // REGISTER
    @Transactional
    public User register(RegisterRequest request) {

        if (request == null) {
            throw new RuntimeException("Registration details are required");
        }

        String name = request.getName() == null
                ? ""
                : request.getName().trim();

        String email = normalizeEmail(request.getEmail());

        String password = request.getPassword();

        String role = request.getRole() == null
                ? ""
                : request.getRole().trim().toUpperCase(Locale.ROOT);

        if (name.isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (email.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (!role.equals("USER") && !role.equals("OWNER")) {
            throw new RuntimeException("Invalid role");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        return userRepository.save(user);
    }

    // LOGIN
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {

        if (request == null) {
            throw new RuntimeException("Login details are required");
        }

        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword();

        if (email.isEmpty() || password == null || password.isBlank()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // UPDATE PROFILE
    @Transactional
    public User updateProfile(Long id, String name, String email) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String trimmedName = name == null ? "" : name.trim();
        String trimmedEmail = normalizeEmail(email);

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

    // CHANGE PASSWORD
    @Transactional
    public void changePassword(
            Long id,
            String currentPassword,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentPassword == null
                || currentPassword.isBlank()
                || !passwordEncoder.matches(
                        currentPassword,
                        user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("New password is required");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // FORGOT PASSWORD
    @Transactional
    public void forgotPassword(String email) {

        String normalizedEmail = normalizeEmail(email);

        // Do not reveal whether an email is registered.
        if (normalizedEmail.isEmpty()) {
            return;
        }

        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setResetTokenExpiry(
                    LocalDateTime.now().plusMinutes(30)
            );

            userRepository.save(user);

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    token
            );
        });
    }

    // RESET PASSWORD
    @Transactional
    public void resetPassword(String token, String newPassword) {

        if (token == null || token.isBlank()) {
            throw new RuntimeException("Invalid or expired reset link");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("New password is required");
        }

        User user = userRepository.findByResetToken(token.trim())
                .orElseThrow(() ->
                        new RuntimeException("Invalid or expired reset link")
                );

        if (user.getResetTokenExpiry() == null
                || !user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset link");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }

    private String normalizeEmail(String email) {
        return email == null
                ? ""
                : email.trim().toLowerCase(Locale.ROOT);
    }
}