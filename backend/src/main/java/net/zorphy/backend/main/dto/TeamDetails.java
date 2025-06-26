package net.zorphy.backend.main.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TeamDetails(
        @NotNull
        String name,

        @NotEmpty
        @Valid
        List<PlayerDetails> players
) {
}
