package net.zorphy.backend.catan.dto;

import java.util.List;

public record DiceConfig(
        boolean isBalanced,
        int shuffleThreshold
) {
}
