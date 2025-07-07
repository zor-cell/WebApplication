package net.zorphy.backend.site.qwirkle.dto.move;

import net.zorphy.backend.site.qwirkle.dto.Direction;
import net.zorphy.backend.site.qwirkle.dto.tile.BoardTile;

import java.util.List;

public record MoveGroupInfo(
        Direction direction,
        List<BoardTile> boardTiles
) {
}
