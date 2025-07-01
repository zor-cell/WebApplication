package net.zorphy.backend.project.qwirkle.dto;

public record Position(
        Integer x,
        Integer y
) {
    public Position stepsInDirection(Direction direction, int steps) {
        return new Position(
                this.x + direction.getDx() * steps,
                this.y + direction.getDy() * steps
        );
    }
}
