package net.zorphy.backend.catan.dto.data;

import java.util.List;

public record DiceConfig(
        boolean isBalanced,
        int shuffleThreshold
) {
}
