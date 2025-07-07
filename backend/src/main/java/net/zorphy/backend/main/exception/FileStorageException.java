package net.zorphy.backend.main.exception;

public class FileStorageException extends RuntimeException {
    public FileStorageException(String message) {
        super(message);
    }
    public FileStorageException(String message, Exception ex) {
        super(message, ex);
    }
}
