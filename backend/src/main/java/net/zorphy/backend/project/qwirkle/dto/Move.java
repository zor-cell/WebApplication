package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record Move(
        Position position,
        Direction direction,
        List<Tile> tiles,
        Integer score
) {

}
