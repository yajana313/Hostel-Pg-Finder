package com.pgfinder.pg_service.external;

import com.pgfinder.pg_service.entity.College;
import com.pgfinder.pg_service.repository.CollegeRepository;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private final CollegeRepository collegeRepository;

    public LocationService(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    public double[] findInstitutionLocation(String institution) {

        College college = collegeRepository
                .findFirstByNameContainingIgnoreCase(institution)
                .orElseThrow(() -> new RuntimeException(
                        "College not found in database: " + institution
                ));

        if (college.getLatitude() == null
                || college.getLongitude() == null) {

            throw new RuntimeException(
                    "Latitude or longitude not available for: "
                            + college.getName()
            );
        }

        return new double[]{
                college.getLatitude(),
                college.getLongitude()
        };
    }
}