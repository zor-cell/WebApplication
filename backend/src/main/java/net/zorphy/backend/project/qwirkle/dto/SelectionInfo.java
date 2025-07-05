package net.zorphy.backend.project.qwirkle.dto;

import net.zorphy.backend.project.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.project.qwirkle.dto.tile.SelectionTile;

import java.util.List;

public record SelectionInfo(
        List<SelectionTile> tiles,
        List<MoveGroup> moves
){
}
