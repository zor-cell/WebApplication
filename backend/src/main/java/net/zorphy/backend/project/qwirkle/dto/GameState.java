package net.zorphy.backend.project.qwirkle.dto;

import net.zorphy.backend.project.qwirkle.dto.tile.BoardTile;
import net.zorphy.backend.project.qwirkle.dto.tile.StackTile;
import net.zorphy.backend.project.qwirkle.dto.tile.Tile;

import java.util.List;

public record GameState(
        List<Tile> hand,
        List<StackTile> stack,
        List<BoardTile> board,
        List<PositionInfo> openPositions
) {
}
