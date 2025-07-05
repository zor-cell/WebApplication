package net.zorphy.backend.project.qwirkle.dto.tile;

import net.zorphy.backend.project.qwirkle.dto.Position;

public record BoardTile(
        Position position,
        Tile tile
) {
}
