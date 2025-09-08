package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameType;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(GameType gameType, MultipartFile file);

    String saveFile(String subDirectory, MultipartFile file);

    void deleteFile(String relativePath);
}
