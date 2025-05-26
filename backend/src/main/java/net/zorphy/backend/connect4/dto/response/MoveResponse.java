package net.zorphy.backend.connect4.dto.response;

import net.zorphy.backend.connect4.dto.data.GameState;


public record MoveResponse(
     int[][] board,
     GameState gameState
) {
}
