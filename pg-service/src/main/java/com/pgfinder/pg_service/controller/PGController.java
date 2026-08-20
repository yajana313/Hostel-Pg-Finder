package com.pgfinder.pg_service.controller;

import com.pgfinder.pg_service.entity.PG;
import com.pgfinder.pg_service.service.PGService;
import com.pgfinder.pg_service.dto.HostelDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
public class PGController {

    private final PGService pgService;

    public PGController(PGService pgService) {
        this.pgService = pgService;
    }

    // Add PG
    @PostMapping
    public PG addPG(@RequestBody PG pg) {
        return pgService.addPG(pg);
    }

    // Get all PGs
    @GetMapping
    public List<PG> getAllPGs() {
        return pgService.getAllPGs();
    }

    // Find nearby hostels
    @GetMapping("/nearby")
    public List<HostelDTO> findNearbyHostels(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") int radius) {

        return pgService.findNearbyHostels(
                latitude,
                longitude,
                radius
        );
    }

    // Get PG by ID
    @GetMapping("/{id}")
    public ResponseEntity<PG> getPGById(@PathVariable Long id) {
        return pgService.getPGById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update PG
    @PutMapping("/{id}")
    public PG updatePG(@PathVariable Long id, @RequestBody PG pg) {
        return pgService.updatePG(id, pg);
    }

    // Delete PG
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePG(@PathVariable Long id) {
        pgService.deletePG(id);
        return ResponseEntity.ok("PG deleted successfully");
    }
}