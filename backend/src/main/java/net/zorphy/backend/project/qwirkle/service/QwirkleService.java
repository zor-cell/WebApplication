package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.*;
import net.zorphy.backend.project.qwirkle.dto.move.Move;
import net.zorphy.backend.project.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.project.qwirkle.dto.tile.Tile;

import java.util.List;

public interface QwirkleService {
    List<MoveGroup> getBestMoves(GameState gameState, int maxMoves);

    GameState initGameState(List<Tile> hand);

    GameState drawTile(GameState gameState, Tile tile);

    SelectionInfo selectInHand(GameState gameState, List<Tile> selected);

    GameState clearHand(GameState gameState);

    GameState makeMove(GameState gameState, Move move);

    void uploadImage(byte[] file);
}
