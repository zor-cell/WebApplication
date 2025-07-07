package net.zorphy.backend.site.connect4.dto.request;

public record MoveRequest(
        int[][] board,
        Integer player,
        Integer move
) {

}
