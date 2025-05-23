package net.zorphy.backend.connect4.dto.response;

import net.zorphy.backend.connect4.classes.Position;
import net.zorphy.backend.connect4.enums.GameState;


public record SolveResponse(
         int[][] board,
         GameState gameState,
         Position position,
         int score,
         int winDistance

) {
}
