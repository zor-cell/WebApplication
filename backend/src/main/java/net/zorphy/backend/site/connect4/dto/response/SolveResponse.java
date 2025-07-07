package net.zorphy.backend.site.connect4.dto.response;

import net.zorphy.backend.site.connect4.dto.data.GameState;


public record SolveResponse(
        int[][] board,
        GameState gameState,
        Integer move,
        int score,
        int winDistance

) {
}
