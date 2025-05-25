package net.zorphy.backend.connect4.dto.request;

public record UndoRequest(
    int[][] board,
    Integer move
) {
}
