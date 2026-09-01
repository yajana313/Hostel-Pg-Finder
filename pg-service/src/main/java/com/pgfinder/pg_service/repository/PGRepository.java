package com.pgfinder.pg_service.repository;

import com.pgfinder.pg_service.entity.PG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PGRepository extends JpaRepository<PG, Long> {

    // Search and filter PGs
    @Query("""
        SELECT p FROM PG p
        WHERE (:city IS NULL OR LOWER(p.city) = LOWER(:city))
        AND (:minRent IS NULL OR p.rent >= :minRent)
        AND (:maxRent IS NULL OR p.rent <= :maxRent)
        AND (:gender IS NULL OR LOWER(p.gender) = LOWER(:gender))
        AND (:minRooms IS NULL OR p.availableRooms >= :minRooms)
    """)
    List<PG> searchPG(
            @Param("city") String city,
            @Param("minRent") Double minRent,
            @Param("maxRent") Double maxRent,
            @Param("gender") String gender,
            @Param("minRooms") Integer minRooms
    );
}