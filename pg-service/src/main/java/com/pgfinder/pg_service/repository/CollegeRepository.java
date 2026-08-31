package com.pgfinder.pg_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgfinder.pg_service.entity.College;

public interface CollegeRepository extends JpaRepository<College, Long> {

    List<College> findByNameContainingIgnoreCase(String name);

    List<College> findByUniversityContainingIgnoreCase(String university);
}