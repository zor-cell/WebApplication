package net.zorphy.backend.site.qwirkle.dto;

import net.zorphy.backend.site.qwirkle.dto.enums.Direction;

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
