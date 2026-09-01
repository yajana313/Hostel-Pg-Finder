package com.pgfinder.pg_service.service;

import com.pgfinder.pg_service.entity.PG;
import com.pgfinder.pg_service.repository.PGRepository;
import com.pgfinder.pg_service.external.OverpassService;
import com.pgfinder.pg_service.external.LocationService;
import com.pgfinder.pg_service.dto.HostelDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PGService {

    private final PGRepository pgRepository;
    private final OverpassService overpassService;
    private final LocationService locationService;

    public PGService(
            PGRepository pgRepository,
            OverpassService overpassService,
            LocationService locationService) {

        this.pgRepository = pgRepository;
        this.overpassService = overpassService;
        this.locationService = locationService;
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

    // Search and filter PGs
    public List<PG> searchPG(
            String city,
            Double minRent,
            Double maxRent,
            String gender,
            Integer minRooms) {

        return pgRepository.searchPG(
                city,
                minRent,
                maxRent,
                gender,
                minRooms
        );
    }

    // Find nearby hostels using latitude and longitude
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

    // Find nearby hostels based on college/university
    public List<HostelDTO> findNearbyHostelsByInstitution(
            String institution,
            int radius) {

        double[] location =
                locationService.findInstitutionLocation(institution);

        return overpassService.findNearbyHostels(
                location[0],
                location[1],
                radius
        );
    }
}