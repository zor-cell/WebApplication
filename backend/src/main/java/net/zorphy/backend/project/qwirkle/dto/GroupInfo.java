package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record GroupInfo(
        Direction direction,
        List<BoardTile> boardTiles
) {
}
