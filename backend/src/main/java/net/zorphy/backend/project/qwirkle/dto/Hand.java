package net.zorphy.backend.project.qwirkle.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record Hand(
        @NotNull
        @Size(max = 6)
        List<Tile> tiles
) { }
