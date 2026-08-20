package com.pgfinder.pg_service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgfinder.pg_service.dto.HostelDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class OverpassService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OverpassService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://overpass-api.de")
                .build();

        this.objectMapper = new ObjectMapper();
    }

    public List<HostelDTO> findNearbyHostels(
            double latitude,
            double longitude,
            int radius) {

        String query = """
                [out:json][timeout:30];

                nwr["tourism"="hostel"]
                (around:%d,%f,%f);

                out center;
                """.formatted(
                radius,
                latitude,
                longitude
        );

        String response = restClient.post()
                .uri("/api/interpreter")
                .header(
                        "Content-Type",
                        "application/x-www-form-urlencoded"
                )
                .body("data=" + query)
                .retrieve()
                .body(String.class);

        return convertToHostelDTO(response);
    }

    private List<HostelDTO> convertToHostelDTO(String json)
            throws RuntimeException {

        List<HostelDTO> hostels = new ArrayList<>();

        try {

            JsonNode root = objectMapper.readTree(json);
            JsonNode elements = root.get("elements");

            if (elements == null) {
                return hostels;
            }

            for (JsonNode element : elements) {

                JsonNode tags = element.get("tags");

                if (tags == null) {
                    continue;
                }

                String name = tags.has("name")
                        ? tags.get("name").asText()
                        : "Unknown Hostel";

                Double lat = null;
                Double lon = null;

                // Node
                if (element.has("lat") && element.has("lon")) {

                    lat = element.get("lat").asDouble();
                    lon = element.get("lon").asDouble();

                }

                // Way / Relation
                else if (element.has("center")) {

                    JsonNode center = element.get("center");

                    lat = center.get("lat").asDouble();
                    lon = center.get("lon").asDouble();
                }

                if (lat != null && lon != null) {

                    hostels.add(
                            new HostelDTO(
                                    name,
                                    lat,
                                    lon,
                                    "HOSTEL"
                            )
                    );
                }
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error parsing Overpass response",
                    e
            );
        }

        return hostels;
    }
}