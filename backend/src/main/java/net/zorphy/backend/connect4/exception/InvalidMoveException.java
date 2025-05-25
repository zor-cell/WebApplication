package net.zorphy.backend.connect4.exception;

public class InvalidMoveException extends RuntimeException {
    public InvalidMoveException() {
        super("Invalid Move");
    }
}
