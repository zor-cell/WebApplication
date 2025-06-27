package net.zorphy.backend.project.qwirkle.dto;

public enum Shape {
    NONE(0),
    CIRCLE(1 << 0),
    SQUARE(1 << 1),
    DIAMOND(1 << 2),
    CLOVER(1 << 3),
    STAR4(1 << 4),
    STAR8(1 << 5);

    private final int value;

    Shape(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
