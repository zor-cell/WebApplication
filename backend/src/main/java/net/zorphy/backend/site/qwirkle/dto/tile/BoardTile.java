package net.zorphy.backend.site.qwirkle.dto.tile;

import net.zorphy.backend.site.qwirkle.dto.Position;

public record BoardTile(
        Position position,
        Tile tile
) {
}
