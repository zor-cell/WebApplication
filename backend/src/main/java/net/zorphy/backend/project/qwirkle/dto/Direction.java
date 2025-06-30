package net.zorphy.backend.project.qwirkle.dto;

public enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT;

    public int getDy() {
        if(this == Direction.UP) return 1;
        else if(this == Direction.DOWN) return -1;

        return 0;
    }

    public int getDx() {
        if(this == Direction.LEFT) return -1;
        else if(this == Direction.RIGHT) return 1;

        return 0;
    }

    public Direction rotate90Deg() {
        if(this == Direction.UP) return Direction.RIGHT;
        else if(this == Direction.RIGHT) return Direction.DOWN;
        else if(this == Direction.DOWN) return Direction.LEFT;

        return Direction.UP;
    }

    public Direction inverse() {
        if(this == Direction.UP) return Direction.DOWN;
        else if(this == Direction.RIGHT) return Direction.LEFT;
        else if(this == Direction.DOWN) return Direction.UP;

        return Direction.RIGHT;
    }

    public static Direction[][] getPairs() {
        return new Direction[][] {
                {Direction.UP, Direction.DOWN},
                {Direction.LEFT, Direction.RIGHT}
        };
    }
}
