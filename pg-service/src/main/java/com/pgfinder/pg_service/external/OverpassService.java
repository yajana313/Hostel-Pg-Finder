package com.pgfinder.pg_service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgfinder.pg_service.dto.HostelDTO;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
                [out:json][timeout:60];

                (
                    nwr["tourism"="hostel"]["name"]
                    (around:%d,%f,%f);

                    nwr["amenity"="hostel"]["name"]
                    (around:%d,%f,%f);
                );

                out center;
                """.formatted(
                radius, latitude, longitude,
                radius, latitude, longitude
        );

        try {

            MultiValueMap<String, String> formData =
                    new LinkedMultiValueMap<>();

            formData.add("data", query);

            String response = restClient.post()
                    .uri("/api/interpreter")
                    .contentType(
                            MediaType.APPLICATION_FORM_URLENCODED
                    )
                    .body(formData)
                    .retrieve()
                    .body(String.class);

            if (response == null || response.isBlank()) {
                return new ArrayList<>();
            }

            return convertToHostelDTO(response);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to find nearby hostels",
                    e
            );
        }
    }

    private List<HostelDTO> convertToHostelDTO(String json) {

        List<HostelDTO> hostels = new ArrayList<>();

        Set<String> addedNames = new HashSet<>();

        try {

            JsonNode root = objectMapper.readTree(json);

            JsonNode elements = root.get("elements");

            if (elements == null || !elements.isArray()) {
                return hostels;
            }

            for (JsonNode element : elements) {

                JsonNode tags = element.get("tags");

                if (tags == null || !tags.has("name")) {
                    continue;
                }

                String name = tags.get("name").asText();

                if (name == null || name.isBlank()) {
                    continue;
                }

                String lowerName = name.toLowerCase();

                /*
                 * School related hostel results remove
                 */
                if (lowerName.contains("school")
                        || lowerName.contains("primary school")
                        || lowerName.contains("secondary school")) {

                    continue;
                }

                /*
                 * Generic names remove
                 */
                if (lowerName.equals("hostel")
                        || lowerName.equals("unknown hostel")
                        || lowerName.equals("dormitory")) {

                    continue;
                }

                /*
                 * Duplicate remove
                 */
                if (addedNames.contains(lowerName)) {
                    continue;
                }

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

                    if (center.has("lat") && center.has("lon")) {

                        lat = center.get("lat").asDouble();
                        lon = center.get("lon").asDouble();
                    }
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

                    addedNames.add(lowerName);
                }
            }

            return hostels;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error parsing Overpass response",
                    e
            );
        }
    }
}