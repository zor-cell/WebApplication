package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;

import java.util.List;
import java.util.UUID;

public interface GameService {
    List<GameMetadata> getGames();

    GameDetails getGame(UUID id);

    GameDetails saveGame(GameDetails gameDetails);
}
