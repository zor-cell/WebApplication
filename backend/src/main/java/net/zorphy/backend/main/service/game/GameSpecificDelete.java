package net.zorphy.backend.main.service.game;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.entity.Game;

public interface GameSpecificDelete {
    GameType supportedType();

    void beforeDelete(Game game);
}
