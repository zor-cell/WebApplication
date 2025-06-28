package net.zorphy.backend.project.qwirkle.dto;

public record Tile(
        Color color,
        Shape shape
) {
    public boolean isCompatible(Color color, Shape shape) {
        //if the color is the same, the shape has to be different
        boolean sameColorMissingShape = this.color == color && !shape.hasShape(this.shape);
        //if the shape is the same, the color has to be different
        boolean sameShapeMissingColor = this.shape == shape && !color.hasColor(this.color);

        return sameColorMissingShape || sameShapeMissingColor;
    }
}
