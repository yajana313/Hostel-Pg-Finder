package com.pgfinder.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import com.pgfinder.auth_service.dto.ChangePasswordRequest;
import com.pgfinder.auth_service.dto.ForgotPasswordRequest;
import com.pgfinder.auth_service.dto.LoginRequest;
import com.pgfinder.auth_service.dto.RegisterRequest;
import com.pgfinder.auth_service.dto.ResetPasswordRequest;
import com.pgfinder.auth_service.dto.UpdateProfileRequest;
import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(
            @RequestBody LoginRequest request) {

        User user = authService.login(request);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request) {

        User user = authService.updateProfile(
                id, request.getName(), request.getEmail());

        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {

        authService.changePassword(
                id, request.getCurrentPassword(), request.getNewPassword());

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "If that email is registered, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request.getToken(), request.getNewPassword());

        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }
}