package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.site.all.GameSessionService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;

public interface JollyService extends GameSessionService<GameConfig, GameState, ResultState> {
}
