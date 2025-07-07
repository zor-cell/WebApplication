package net.zorphy.backend.site.connect4.dto.request;

import net.zorphy.backend.site.connect4.dto.data.Version;

public record SolveRequest(
        int[][] board,
        int player,
        int maxTime,
        int maxDepth,
        int tableSize,
        Version version
) {
}
