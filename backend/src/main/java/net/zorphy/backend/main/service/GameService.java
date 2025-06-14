package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.GameDetails;

import java.util.List;

public interface GameService {
    List<GameDetails> getGames();

    GameDetails saveGame(GameDetails gameDetails);
}
