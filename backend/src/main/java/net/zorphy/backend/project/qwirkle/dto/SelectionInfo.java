package net.zorphy.backend.project.qwirkle.dto;

import java.util.List;

public record SelectionInfo(
        List<SelectionTile> tiles,
        List<MoveGroup> moves
){
}
