package com.pgfinder.pg_service.service;

import com.pgfinder.pg_service.entity.College;
import com.pgfinder.pg_service.repository.CollegeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;

    public CollegeService(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    // Get all colleges and universities
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    // Search by college/university name
    public List<College> searchColleges(String name) {
        return collegeRepository.findByNameContainingIgnoreCase(name);
    }

    // Search colleges by university
    public List<College> searchByUniversity(String university) {
        return collegeRepository.findByUniversityContainingIgnoreCase(university);
    }

    // Add new college/university
    public College addCollege(College college) {
        return collegeRepository.save(college);
    }

    // Get college by ID
    public College getCollegeById(Long id) {
        return collegeRepository.findById(id).orElse(null);
    }
}