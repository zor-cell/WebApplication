package net.zorphy.backend.project.qwirkle.dto;

public record Position(
        Integer i,
        Integer j
) {
    public Position stepsInDirection(Direction direction, int steps) {
        return new Position(
                this.i + direction.getDi() * steps,
                this.j + direction.getDj() * steps
                );
    }
}
