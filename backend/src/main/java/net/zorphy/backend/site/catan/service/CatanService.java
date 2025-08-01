package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.site.all.GameSessionService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;

public interface CatanService extends GameSessionService<GameConfig, GameState, ResultState> {
    GameState rollDice(GameState gameState, boolean isAlchemist);
}