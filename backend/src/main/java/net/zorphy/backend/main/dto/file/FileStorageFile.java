package net.zorphy.backend.main.dto.file;

public record FileStorageFile(
        String fileName,
        byte[] bytes
) {
}
