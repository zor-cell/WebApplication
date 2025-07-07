package net.zorphy.backend.site.qwirkle.dto;

import net.zorphy.backend.site.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.site.qwirkle.dto.tile.SelectionTile;

import java.util.List;

public record SelectionInfo(
        List<SelectionTile> tiles,
        List<MoveGroup> moves
){
}
