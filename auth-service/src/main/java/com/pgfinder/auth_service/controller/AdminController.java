package com.pgfinder.auth_service.controller;

import com.pgfinder.auth_service.entity.User;
import com.pgfinder.auth_service.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }
    @GetMapping("/users/count")
public ResponseEntity<Long> getUserCount() {

    return ResponseEntity.ok(adminService.getUserCount());
}

@GetMapping("/owners/count")
public ResponseEntity<Long> getOwnerCount() {

    return ResponseEntity.ok(adminService.getOwnerCount());
}
@DeleteMapping("/users/{id}")
public ResponseEntity<String> deleteUser(@PathVariable Long id) {

    adminService.deleteUser(id);

    return ResponseEntity.ok("User deleted successfully");
}
}