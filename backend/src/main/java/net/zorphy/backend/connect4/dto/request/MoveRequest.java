package net.zorphy.backend.connect4.dto.request;

import net.zorphy.backend.connect4.classes.Position;

public record MoveRequest(
        int[][] board,
        Integer player,
        Integer move
) {

}
