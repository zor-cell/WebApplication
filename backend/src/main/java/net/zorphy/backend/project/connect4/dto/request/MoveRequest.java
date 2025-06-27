package net.zorphy.backend.project.connect4.dto.request;

public record MoveRequest(
        int[][] board,
        Integer player,
        Integer move
) {

}
