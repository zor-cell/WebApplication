package net.zorphy.backend.catan.service;

import net.zorphy.backend.catan.dto.GameConfig;
import net.zorphy.backend.catan.dto.GameState;
import net.zorphy.backend.catan.dto.SaveGameState;
import net.zorphy.backend.main.dto.GameDetails;

public interface CatanService {
    GameState initGameState(GameConfig gameConfig);
    GameState updateGameState(GameState gameState, GameConfig gameConfig);

    GameState rollDice(GameState gameState, boolean isAlchemist);

    GameDetails saveGame(GameState gameState, SaveGameState saveGameState);
}
