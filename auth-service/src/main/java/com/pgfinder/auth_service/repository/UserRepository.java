package com.pgfinder.auth_service.repository;

import com.pgfinder.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check whether email already exists
    boolean existsByEmail(String email);

    // Find user by password reset token
    Optional<User> findByResetToken(String resetToken);

    // Count users by role
    long countByRoleIgnoreCase(String role);
}