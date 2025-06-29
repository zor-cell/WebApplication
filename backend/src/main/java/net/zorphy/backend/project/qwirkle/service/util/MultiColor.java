package net.zorphy.backend.project.qwirkle.service.util;

import net.zorphy.backend.project.qwirkle.dto.Color;

public class MultiColor {
    private int flags = 0;

    public int getValue() {
        return flags;
    }

    public void addFlag(Color color) {
        flags |= color.getValue();
    }

    /**
     * Indicates whether the color includes the given color.*
     */
    public boolean hasColor(Color color) {
        return (flags & color.getValue()) != 0;
    }

    /**
     * Indicates whether the color is a single color or consists of multiple colors.
     */
    public boolean isSingle() {
        return Integer.bitCount(flags) == 1;
    }
}
