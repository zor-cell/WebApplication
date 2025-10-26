package net.zorphy.backend.site.all.service;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.dto.GameStateBase;

public interface GameSpecificMapper {
    GameType supportedType();

    GameStateBase mapGameState(GameStateBase gameState);
}
