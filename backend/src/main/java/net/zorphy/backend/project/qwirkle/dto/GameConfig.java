package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record GameConfig(
        List<Tile> hand
) {
}
