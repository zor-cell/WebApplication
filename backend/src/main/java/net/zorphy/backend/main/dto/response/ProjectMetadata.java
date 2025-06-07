package net.zorphy.backend.main.dto.response;

import java.time.LocalDate;

public record ProjectMetadata(
        String name,
        LocalDate createdAt,
        String description,
        String imagePath,
        String githubUrl,
        Boolean hasWebsite,
        Boolean isFavorite
) {
}
