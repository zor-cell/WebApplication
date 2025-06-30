package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.*;

import java.util.List;

public interface QwirkleService {
    List<MoveGroup> getValidMoves(GameState gameState, List<Tile> tiles);

    List<Move> getBestMoves(GameState gameState, int maxMoves);

    GameState initGameState(List<Tile> hand);

    GameState drawTile(GameState gameState, Tile tile);

    GameState makeMove(GameState gameState, Move move);

    void uploadImage(byte[] file);
}
