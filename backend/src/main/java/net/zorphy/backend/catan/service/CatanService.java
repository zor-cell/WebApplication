package net.zorphy.backend.catan.service;

import net.zorphy.backend.catan.dto.GameConfig;
import net.zorphy.backend.catan.dto.GameState;
import net.zorphy.backend.main.dto.GameDetails;
import net.zorphy.backend.main.dto.TeamDetails;

public interface CatanService {
    GameState getGameStateFromConfig(GameConfig gameConfig);

    GameState rollDice(GameState gameState, boolean isAlchemist);

    GameDetails saveGame(GameState gameState, String winnerTeam);
}
