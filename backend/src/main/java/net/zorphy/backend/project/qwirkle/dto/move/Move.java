package net.zorphy.backend.project.qwirkle.dto.move;

import net.zorphy.backend.project.qwirkle.dto.Direction;
import net.zorphy.backend.project.qwirkle.dto.Position;
import net.zorphy.backend.project.qwirkle.dto.tile.Tile;

import java.util.List;

public record Move(
        Position position,
        Direction direction,
        List<Tile> tiles,
        Integer score
) {

}
