package com.pgfinder.pg_service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class LocationService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public LocationService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .build();

        this.objectMapper = new ObjectMapper();
    }

    public double[] findInstitutionLocation(String institution) {

        String response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", institution + ", Ahmedabad")
                        .queryParam("format", "json")
                        .queryParam("limit", 1)
                        .build())
                .header("User-Agent", "Hostel-PG-Finder")
                .retrieve()
                .body(String.class);

        try {

            JsonNode root = objectMapper.readTree(response);

            if (!root.isArray() || root.isEmpty()) {
                throw new RuntimeException(
                        "Institution location not found: " + institution
                );
            }

            JsonNode firstResult = root.get(0);

            double latitude =
                    firstResult.get("lat").asDouble();

            double longitude =
                    firstResult.get("lon").asDouble();

            return new double[]{
                    latitude,
                    longitude
            };

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to find institution location",
                    e
            );
        }
    }
}