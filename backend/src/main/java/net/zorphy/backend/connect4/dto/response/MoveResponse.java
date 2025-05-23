package net.zorphy.backend.connect4.dto.response;

import net.zorphy.backend.connect4.classes.Position;
import net.zorphy.backend.connect4.enums.GameState;


public record MoveResponse(
     int[][] board,
     Position position,
     GameState gameState
) {
}
