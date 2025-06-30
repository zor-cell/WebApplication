package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record MoveGroup(
        Position position,
        List<Tile> tiles, //tiles included in move
        List<GroupInfo> groupInfos //board tiles that have to be rendered
) {
}
