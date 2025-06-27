package net.zorphy.backend.project.qwirkle.dto;


public enum Color {
    NONE(0),
    ORANGE(1 << 0),
    PURPLE(1 << 1),
    YELLOW(1 << 2),
    RED(1 << 3),
    GREEN(1 << 4),
    BLUE(1 << 5);

    private final int value;
    Color(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
