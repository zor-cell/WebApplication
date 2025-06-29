package net.zorphy.backend.project.qwirkle.dto;

import net.zorphy.backend.project.qwirkle.service.util.MultiColor;
import net.zorphy.backend.project.qwirkle.service.util.MultiShape;

public record Tile(
        Color color,
        Shape shape
) {
    public boolean isCompatible(MultiColor color, MultiShape shape) {
        //if the color is the same, the shape has to be different
        boolean sameColorMissingShape = this.color.getValue() == color.getValue() && !shape.hasShape(this.shape);
        //if the shape is the same, the color has to be different
        boolean sameShapeMissingColor = this.shape.getValue() == shape.getValue() && !color.hasColor(this.color);

        return sameColorMissingShape || sameShapeMissingColor;
    }
}
