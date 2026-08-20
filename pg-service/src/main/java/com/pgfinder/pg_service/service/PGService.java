package com.pgfinder.pg_service.service;

import com.pgfinder.pg_service.entity.PG;
import com.pgfinder.pg_service.repository.PGRepository;
import com.pgfinder.pg_service.external.OverpassService;
import com.pgfinder.pg_service.dto.HostelDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PGService {

    private final PGRepository pgRepository;
    private final OverpassService overpassService;

    public PGService(PGRepository pgRepository,
                     OverpassService overpassService) {

        this.pgRepository = pgRepository;
        this.overpassService = overpassService;
    }

    // Add PG
    public PG addPG(PG pg) {
        return pgRepository.save(pg);
    }

    // Get all PGs
    public List<PG> getAllPGs() {
        return pgRepository.findAll();
    }

    // Get PG by ID
    public Optional<PG> getPGById(Long id) {
        return pgRepository.findById(id);
    }

    // Update PG
    public PG updatePG(Long id, PG pg) {

        PG existingPG = pgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PG not found"));

        existingPG.setName(pg.getName());
        existingPG.setAddress(pg.getAddress());
        existingPG.setCity(pg.getCity());
        existingPG.setRent(pg.getRent());
        existingPG.setAvailableRooms(pg.getAvailableRooms());
        existingPG.setGender(pg.getGender());
        existingPG.setDescription(pg.getDescription());
        existingPG.setAmenities(pg.getAmenities());

        return pgRepository.save(existingPG);
    }

    // Delete PG
    public void deletePG(Long id) {
        pgRepository.deleteById(id);
    }

    // Find nearby hostels using Overpass API
    public List<HostelDTO> findNearbyHostels(
            double latitude,
            double longitude,
            int radius) {

        return overpassService.findNearbyHostels(
                latitude,
                longitude,
                radius
        );
    }
}