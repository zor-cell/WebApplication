package net.zorphy.backend.project.qwirkle.dto;


public enum Color {
    NONE(0),
    ORANGE(1 << 0),
    PURPLE(1 << 1),
    YELLOW(1 << 2),
    RED(1 << 3),
    GREEN(1 << 4),
    BLUE(1 << 5);

    private int value;

    Color(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void addFlag(Color color) {
        this.value |= color.value;
    }

    /**
     * Indicates whether the color includes the given color.*
     */
    public boolean hasColor(Color color) {
        return (this.value & color.value) != 0;
    }

    /**
     * Indicates whether the color is a single color or consists of multiple colors.
     */
    public boolean isSingle() {
        return Integer.bitCount(this.value) == 1;
    }
 }
