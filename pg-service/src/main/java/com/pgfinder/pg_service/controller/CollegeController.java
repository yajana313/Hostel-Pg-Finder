package com.pgfinder.pg_service.controller;

import com.pgfinder.pg_service.entity.College;
import com.pgfinder.pg_service.service.CollegeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    // Get all colleges and universities
    @GetMapping
    public List<College> getAllColleges() {
        return collegeService.getAllColleges();
    }

    // Search college/university by name
    @GetMapping("/search")
    public List<College> searchColleges(@RequestParam String name) {
        return collegeService.searchColleges(name);
    }

    // Search colleges by university
    @GetMapping("/university")
    public List<College> searchByUniversity(@RequestParam String name) {
        return collegeService.searchByUniversity(name);
    }

    // Get college by ID
    @GetMapping("/{id}")
    public College getCollegeById(@PathVariable Long id) {
        return collegeService.getCollegeById(id);
    }

    // Add college/university
    @PostMapping
    public College addCollege(@RequestBody College college) {
        return collegeService.addCollege(college);
    }
}