package com.pgfinder.auth_service.dto;

public class AuthResponse {

    private Long id;
    private String name;
    private String token;
    private String email;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String name, String token, String email, String role) {
        this.id = id;
        this.name = name;
        this.token = token;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}