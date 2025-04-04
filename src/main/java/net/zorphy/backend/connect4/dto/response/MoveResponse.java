package net.zorphy.backend.connect4.dto.response;

import net.zorphy.backend.connect4.enums.GameState;

import javax.swing.text.Position;

public record MoveResponse(
     int[][] board,
     Position position,
     GameState gameState
) {
}
