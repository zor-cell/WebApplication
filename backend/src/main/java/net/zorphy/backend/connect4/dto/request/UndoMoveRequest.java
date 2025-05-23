package net.zorphy.backend.connect4.dto.request;

import net.zorphy.backend.connect4.classes.Position;

public record UndoMoveRequest(
    int[][] board,
    Position move
) {
}
