package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface QwirkleService {
    GameState initGameState(Hand hand);

    GameState drawTile(GameState gameState, Tile tile);

    Move makeBestMove(GameState gameState);

    GameState makeMove(GameState gameState, BoardTile boardTile);

    void uploadImage(byte[] file);
}
