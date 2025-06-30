package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record MoveGroup(
        Position position,
        List<Direction> directions,
        List<Tile> tiles
) {
}
