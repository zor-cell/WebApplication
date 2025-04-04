package net.zorphy.backend.connect4.dto.response;

import net.zorphy.backend.connect4.enums.GameState;

import javax.swing.text.Position;

public record SolveResponse(
         int[][] board,
         GameState gameState,
         Position position,
         int score,
         int winDistance

) {
}
