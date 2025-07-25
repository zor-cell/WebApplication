package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.site.GameSessionService;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;

public interface CatanService extends GameSessionService<GameConfig, GameState> {
    GameState rollDice(GameState gameState, boolean isAlchemist);
}