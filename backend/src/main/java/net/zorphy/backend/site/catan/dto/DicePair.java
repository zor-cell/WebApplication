package net.zorphy.backend.site.catan.dto;

public record DicePair(
        int dice1,

        int dice2,

        String event
) {
    public int sum() {
        return dice1() + dice2();
    }
}
