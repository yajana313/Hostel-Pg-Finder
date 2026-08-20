package com.pgfinder.pg_service.repository;

import com.pgfinder.pg_service.entity.PG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PGRepository extends JpaRepository<PG, Long> {
}