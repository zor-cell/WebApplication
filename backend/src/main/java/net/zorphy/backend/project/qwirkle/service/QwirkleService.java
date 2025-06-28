package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.GameState;
import net.zorphy.backend.project.qwirkle.dto.Hand;
import net.zorphy.backend.project.qwirkle.dto.Tile;
import org.springframework.web.multipart.MultipartFile;

public interface QwirkleService {
    GameState initGameState(Hand hand);

    GameState drawTile(GameState gameState, Tile tile);

    void uploadImage(byte[] file);
}
