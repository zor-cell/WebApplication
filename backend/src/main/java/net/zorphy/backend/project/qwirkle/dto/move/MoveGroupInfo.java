package net.zorphy.backend.project.qwirkle.dto.move;

import net.zorphy.backend.project.qwirkle.dto.Direction;
import net.zorphy.backend.project.qwirkle.dto.tile.BoardTile;

import java.util.List;

public record MoveGroupInfo(
        Direction direction,
        List<BoardTile> boardTiles
) {
}
