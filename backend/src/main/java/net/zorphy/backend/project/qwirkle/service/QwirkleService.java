package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.*;

import java.util.List;

public interface QwirkleService {
    GameState initGameState(Hand hand);

    GameState drawTile(GameState gameState, Tile tile);

    List<Move> makeBestMoves(GameState gameState, int maxMoves);

    GameState makeMove(GameState gameState, Move move);

    void uploadImage(byte[] file);
}
