package net.zorphy.backend.connect4.dto.request;

import javax.swing.text.Position;

public record UndoMoveRequest(
    int[][] board,
    Integer move
) {
}
