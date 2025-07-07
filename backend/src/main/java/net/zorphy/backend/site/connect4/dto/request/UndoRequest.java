package net.zorphy.backend.site.connect4.dto.request;

public record UndoRequest(
        int[][] board,
        Integer move
) {
}
