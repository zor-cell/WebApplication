package net.zorphy.backend.main.dto;

public record FileStorageFile(
        String fileName,
        byte[] bytes
) {
}
