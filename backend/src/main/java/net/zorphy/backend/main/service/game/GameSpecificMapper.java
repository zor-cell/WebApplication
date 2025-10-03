package net.zorphy.backend.main.service.game;

import net.zorphy.backend.main.dto.game.GameType;

public interface GameSpecificMapper {
    GameType supportedType();

    Object mapGameState(Object gameState);
}
