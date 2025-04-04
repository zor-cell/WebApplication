package net.zorphy.backend.connect4.dto.request;

import net.zorphy.backend.connect4.enums.Version;

public record SolveRequest(
    int[][] board,
    int player,
    int maxTime,
    int maxDepth,
    int tableSize,
    Version version
) {
}
