package net.zorphy.backend.dto.connect4.request;

import javax.swing.text.Position;

public record UndoMoveRequest(
    int[][] board,

    Position position
) {
}
