package net.zorphy.backend.main.dto.response;

public record ProjectDetails(
    ProjectMetadata metadata,
    String content
) {
}
