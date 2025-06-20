package net.zorphy.backend.catan.dto;

public record DiceConfig(
        boolean isBalanced,
        int shuffleThreshold
) {
}
