package net.zorphy.backend.project.connect4.dto.request;

public record UndoRequest(
    int[][] board,
    Integer move
) {
}
