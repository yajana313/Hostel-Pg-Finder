package com.pgfinder.auth_service.service;

import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public long getUserCount() {
    return userRepository.findAll()
            .stream()
            .filter(user -> "USER".equalsIgnoreCase(user.getRole()))
            .count();
}

public long getOwnerCount() {
    return userRepository.findAll()
            .stream()
            .filter(user -> "OWNER".equalsIgnoreCase(user.getRole()))
            .count();
}
public void deleteUser(Long id) {

    if (!userRepository.existsById(id)) {
        throw new RuntimeException("User not found");
    }

    userRepository.deleteById(id);
}
}