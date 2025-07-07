package net.zorphy.backend.site.connect4.dto.response;

import net.zorphy.backend.site.connect4.dto.data.GameState;


public record MoveResponse(
        int[][] board,
        GameState gameState
) {
}
