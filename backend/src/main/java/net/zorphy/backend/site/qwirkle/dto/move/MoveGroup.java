package net.zorphy.backend.site.qwirkle.dto.move;

import net.zorphy.backend.site.qwirkle.dto.Position;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;

import java.util.List;

public record MoveGroup(
        Position position,
        List<Tile> tiles, //tiles included in move
        List<MoveGroupInfo> groupInfos //board tiles that have to be rendered
) {
}
