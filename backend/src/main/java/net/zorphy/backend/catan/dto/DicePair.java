package net.zorphy.backend.catan.dto;

import jakarta.validation.constraints.Min;

import java.util.Objects;

public record DicePair(
        int dice1,

        int dice2,

        String event
) {
    public int sum() {
        return dice1() + dice2();
    }
}
