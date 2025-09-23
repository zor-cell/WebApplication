package net.zorphy.backend.main.service.game;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;

public interface GameSpecificDelete {
    GameType supportedType();

    void beforeDelete(GameDetails gameDetails);
}
