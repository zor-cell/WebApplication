package net.zorphy.backend.dto.connect4.response;

import net.zorphy.backend.enums.connect4.GameState;

import javax.swing.text.Position;

public record MoveResponse(
     int[][] board,
     Position position,
     GameState gameState
) {
}
