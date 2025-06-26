package net.zorphy.backend.main.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

public record ProjectDetails(
        @NotNull
        @Valid
        ProjectMetadata metadata,

        @Null
        String content,

        @NotBlank
        String filePath
) {
}
