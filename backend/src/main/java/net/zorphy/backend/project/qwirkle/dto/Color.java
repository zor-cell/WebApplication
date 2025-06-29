package net.zorphy.backend.project.qwirkle.dto;


import java.util.EnumSet;

public enum Color {
    ORANGE(1),
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
