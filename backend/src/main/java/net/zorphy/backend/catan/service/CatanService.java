package net.zorphy.backend.catan.service;

import net.zorphy.backend.catan.dto.data.GameConfig;
import net.zorphy.backend.catan.dto.data.GameState;

public interface CatanService {
    GameState getGameStateFromConfig(GameConfig gameConfig);

    GameState rollDice(GameState gameState, boolean isAlchemist);
}
