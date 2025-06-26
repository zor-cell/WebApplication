package net.zorphy.backend.main.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TeamDetails(
        @NotBlank
        String name,

        @NotEmpty
        @Valid
        List<PlayerDetails> players
) {
}
