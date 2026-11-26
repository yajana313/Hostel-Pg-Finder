package com.pgfinder.auth_service.controller;

import com.pgfinder.auth_service.dto.ChangePasswordRequest;
import com.pgfinder.auth_service.dto.ForgotPasswordRequest;
import com.pgfinder.auth_service.dto.LoginRequest;
import com.pgfinder.auth_service.dto.RegisterRequest;
import com.pgfinder.auth_service.dto.ResetPasswordRequest;
import com.pgfinder.auth_service.dto.UpdateProfileRequest;
import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.repository.UserRepository;
import com.pgfinder.auth_service.service.AuthService;
import com.pgfinder.auth_service.service.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            JwtService jwtService,
            UserRepository userRepository) {

        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "message", "Registration successful"
        ));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest request) {

        User user = authService.login(request);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "token", token,
                "message", "Login successful"
        ));
    }

    // UPDATE PROFILE
    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        verifyUserAccess(id, authentication);

        User user = authService.updateProfile(
                id,
                request.getName(),
                request.getEmail()
        );

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "message", "Profile updated successfully"
        ));
    }

    // CHANGE PASSWORD
    @PutMapping("/users/{id}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        verifyUserAccess(id, authentication);

        authService.changePassword(
                id,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Password updated successfully"
        ));
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(Map.of(
                "message",
                "If that email is registered, a reset link has been sent."
        ));
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully."
        ));
    }

    // Verify that the logged-in user owns this account
    private void verifyUserAccess(
            Long id,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (!user.getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own account"
            );
        }
    }
}