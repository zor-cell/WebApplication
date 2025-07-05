package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.qwirkle.dto.*;
import net.zorphy.backend.project.qwirkle.dto.move.Move;
import net.zorphy.backend.project.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.project.qwirkle.dto.tile.Tile;

import java.util.List;

public interface QwirkleService {
    /**
     * Retrieves the {@code N} best moves for the given {@code gameState} where {@code N} is {@code maxMoves}.
     */
    List<MoveGroup> getBestMoves(GameState gameState, int maxMoves);

    /**
     * Initialises the game state for the session.
     */
    GameState initGameState(List<Tile> hand);

    /**
     * Draws the given {@code tile} from the stack in the given {@code gameState}.
     */
    GameState drawTile(GameState gameState, Tile tile);

    /**
     * Retrieves the selection information for the given {@code tiles} in the given {@code gameState}.
     */
    SelectionInfo selectInHand(GameState gameState, List<Tile> tiles);

    /**
     * Clears the hand in the given {@code gameState}.
     */
    GameState clearHand(GameState gameState);

    /**
     * Makes the given {@code move} in the given {@code gameState}.
     */
    GameState makeMove(GameState gameState, Move move);

    void uploadImage(byte[] file);
}
