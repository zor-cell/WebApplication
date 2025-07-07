package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;

import java.util.List;

public interface GameService {
    List<GameMetadata> getGames();

    GameDetails saveGame(GameDetails gameDetails);
}
