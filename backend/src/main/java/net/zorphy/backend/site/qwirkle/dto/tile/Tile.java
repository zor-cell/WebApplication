package net.zorphy.backend.site.qwirkle.dto.tile;

import net.zorphy.backend.site.qwirkle.dto.enums.Color;
import net.zorphy.backend.site.qwirkle.dto.enums.Shape;
import net.zorphy.backend.site.qwirkle.service.util.MultiColor;
import net.zorphy.backend.site.qwirkle.service.util.MultiShape;

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

    public boolean isCompatible(Tile tile) {
        //if the color is the same, the shape has to be different
        boolean sameColorMissingShape = this.color.getValue() == tile.color.getValue() && this.shape.getValue() != tile.shape.getValue();
        //if the shape is the same, the color has to be different
        boolean sameShapeMissingColor = this.shape.getValue() == tile.shape.getValue() && this.color.getValue() != tile.color.getValue();

        return sameColorMissingShape || sameShapeMissingColor;
    }
}
