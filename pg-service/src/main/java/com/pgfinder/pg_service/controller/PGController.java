package com.pgfinder.pg_service.controller;

import com.pgfinder.pg_service.entity.PG;
import com.pgfinder.pg_service.service.PGService;
import com.pgfinder.pg_service.dto.HostelDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
@CrossOrigin(origins = "http://localhost:5173")
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

    // Get pending PGs for admin
    @GetMapping("/admin/pending")
    public ResponseEntity<List<PG>> getPendingPGs() {
        List<PG> pendingPGs = pgService.getPendingPGs();
        return ResponseEntity.ok(pendingPGs);
    }

    // Approve PG
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<PG> approvePG(@PathVariable Long id) {
        PG approvedPG = pgService.approvePG(id);
        return ResponseEntity.ok(approvedPG);
    }

    // Reject PG
    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<PG> rejectPG(@PathVariable Long id) {
        PG rejectedPG = pgService.rejectPG(id);
        return ResponseEntity.ok(rejectedPG);
    }

    // Get approved PGs for admin
    @GetMapping("/admin/approved")
    public ResponseEntity<List<PG>> getApprovedPGs() {
        return ResponseEntity.ok(pgService.getApprovedPGs());
    }

    // Get rejected PGs for admin
    @GetMapping("/admin/rejected")
    public ResponseEntity<List<PG>> getRejectedPGs() {
        return ResponseEntity.ok(pgService.getRejectedPGs());
    }

    // Admin: add a PG directly (goes live immediately, no review needed)
    @PostMapping("/admin/add")
    public PG addPGAsAdmin(@RequestBody PG pg) {
        return pgService.addPGApproved(pg);
    }

    // Admin: permanently delete a PG
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> deletePGAsAdmin(@PathVariable Long id) {
        pgService.deletePG(id);
        return ResponseEntity.ok("PG deleted successfully");
    }

    // Owner: list only the PGs this owner has listed
    @GetMapping("/owner/mine")
    public ResponseEntity<List<PG>> getMyPGs(Authentication authentication) {
        return ResponseEntity.ok(pgService.getPGsByOwner(authentication.getName()));
    }

    // Owner: add a new PG under their own account (goes to review first)
    @PostMapping("/owner/add")
    public PG addPGAsOwner(@RequestBody PG pg, Authentication authentication) {
        return pgService.addPGForOwner(pg, authentication.getName());
    }

    // Owner: edit one of their own PGs (re-enters review)
    @PutMapping("/owner/{id}")
    public PG updatePGAsOwner(
            @PathVariable Long id, @RequestBody PG pg, Authentication authentication) {
        return pgService.updatePGForOwner(id, pg, authentication.getName());
    }

    // Owner: delete one of their own PGs
    @DeleteMapping("/owner/{id}")
    public ResponseEntity<String> deletePGAsOwner(
            @PathVariable Long id, Authentication authentication) {
        pgService.deletePGForOwner(id, authentication.getName());
        return ResponseEntity.ok("PG deleted successfully");
    }

    // Find nearby hostels using latitude and longitude
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

    // Find nearby hostels based on college/university
    @GetMapping("/nearby-by-institution")
    public List<HostelDTO> findNearbyHostelsByInstitution(
            @RequestParam String institution,
            @RequestParam(defaultValue = "3000") int radius) {

        return pgService.findNearbyHostelsByInstitution(
                institution,
                radius
        );
    }

    // Search and filter PGs
    @GetMapping("/search")
    public List<PG> searchPG(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRent,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minRooms) {

        return pgService.searchPG(
                city,
                minRent,
                maxRent,
                gender,
                minRooms
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