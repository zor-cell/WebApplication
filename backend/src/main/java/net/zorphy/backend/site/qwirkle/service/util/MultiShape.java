package net.zorphy.backend.site.qwirkle.service.util;

import net.zorphy.backend.site.qwirkle.dto.Shape;

public class MultiShape {
    private int flags = 0;

    public int getValue() {
        return flags;
    }

    public void addFlag(Shape shape) {
        flags |= shape.getValue();
    }

    /**
     * Indicates whether the color includes the given color.*
     */
    public boolean hasShape(Shape shape) {
        return (flags & shape.getValue()) != 0;
    }

    /**
     * Indicates whether the color is a single color or consists of multiple colors.
     */
    public boolean isSingle() {
        return Integer.bitCount(flags) == 1;
    }

    public boolean isCompatible(MultiShape shape) {
        return (this.flags & shape.flags) == 0;
    }
}
