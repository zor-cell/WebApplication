package net.zorphy.backend.site.qwirkle.dto.game;

import net.zorphy.backend.site.GameStateBase;
import net.zorphy.backend.site.qwirkle.dto.PositionInfo;
import net.zorphy.backend.site.qwirkle.dto.move.Move;
import net.zorphy.backend.site.qwirkle.dto.tile.BoardTile;
import net.zorphy.backend.site.qwirkle.dto.tile.StackTile;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;

import java.time.LocalDateTime;
import java.util.List;

public record GameState(
        LocalDateTime startTime,
        GameConfig gameConfig,
        int currentPlayerTurn,
        List<Move> moves,
        List<Tile> hand,
        List<StackTile> stack,
        List<BoardTile> board,
        List<PositionInfo> openPositions
) implements GameStateBase {
}
