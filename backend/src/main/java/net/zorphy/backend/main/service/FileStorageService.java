package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameType;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Saves a file to the following directory: files/games/{@code gameTypes}/
     * @return The filepath to the saved file as it is saved in the database: games/{@code gameTypes}/
     */
    String saveFile(GameType gameType, MultipartFile file);

    /**
     * Saves a file to the following directory: files/{@code subDirectory}/
     * @return The filepath to the saved file as it is saved in the database: {@code subDirectory}/
     */
    String saveFile(String subDirectory, MultipartFile file);

    /**
     * Deletes a file from the given path: files/{@code relativePath}
     */
    void deleteFile(String relativePath);
}
