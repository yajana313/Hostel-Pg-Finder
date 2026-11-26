package com.pgfinder.auth_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;

    public JwtService(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException(
                    "jwt.secret must be configured in application.properties"
            );
        }

        byte[] keyBytes;

        try {
            keyBytes = Decoders.BASE64.decode(secret.trim());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "jwt.secret must be a valid Base64-encoded secret",
                    exception
            );
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token valid for 24 hours
    public String generateToken(String email, String role) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required for JWT");
        }

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role is required for JWT");
        }

        Instant now = Instant.now();

        return Jwts.builder()
                .subject(email.trim())
                .claim("role", role.trim())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(24, ChronoUnit.HOURS)))
                .signWith(key)
                .compact();
    }

    // Validate token signature and expiration, then return claims
    public Claims extractClaims(String token) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("JWT token is required");
        }

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token.trim())
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);

            return claims.getSubject() != null
                    && !claims.getSubject().isBlank()
                    && claims.get("role", String.class) != null;
        } catch (Exception exception) {
            return false;
        }
    }
}