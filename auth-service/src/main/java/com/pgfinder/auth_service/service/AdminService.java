package com.pgfinder.auth_service.service;

import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all registered users
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get total USER count
    @Transactional(readOnly = true)
    public long getUserCount() {
        return userRepository.countByRoleIgnoreCase("USER");
    }

    // Get total OWNER count
    @Transactional(readOnly = true)
    public long getOwnerCount() {
        return userRepository.countByRoleIgnoreCase("OWNER");
    }

    // Delete user by ID
    @Transactional
    public void deleteUser(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                    "Invalid user ID");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}