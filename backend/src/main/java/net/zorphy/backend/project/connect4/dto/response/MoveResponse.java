package net.zorphy.backend.project.connect4.dto.response;

import net.zorphy.backend.project.connect4.dto.data.GameState;


public record MoveResponse(
     int[][] board,
     GameState gameState
) {
}
