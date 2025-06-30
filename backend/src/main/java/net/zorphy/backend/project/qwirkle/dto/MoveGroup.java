package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record MoveGroup(
        Position position,
        List<Tile> tiles, //tiles included in move
        List<Direction> directions,
        List<BoardTile> boardTiles //board tiles that have to be rendered
) {
}
