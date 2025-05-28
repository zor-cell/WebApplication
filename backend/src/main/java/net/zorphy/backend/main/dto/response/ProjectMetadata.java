package net.zorphy.backend.main.dto.response;

import java.time.LocalDate;

public record ProjectMetadata(
        String name,
        LocalDate createdAt,
        String websiteUrl,
        String githubUrl
) {
}
