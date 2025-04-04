package net.zorphy.backend.dto.connect4.request;

import net.zorphy.backend.enums.connect4.Version;

public record SolveRequest(
    int[][] board,
    int player,
    int maxTime,
    int maxDepth,
    int tableSize,
    Version version
) {
}
