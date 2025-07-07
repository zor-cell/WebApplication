package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.catan.dto.GameConfig;
import net.zorphy.backend.site.catan.dto.GameState;
import net.zorphy.backend.site.catan.dto.SaveGameState;
import org.springframework.web.multipart.MultipartFile;

public interface CatanService {
    GameState initGameState(GameConfig gameConfig);

    GameState updateGameState(GameState gameState, GameConfig gameConfig);

    GameState rollDice(GameState gameState, boolean isAlchemist);

    GameDetails saveGame(GameState gameState, SaveGameState saveGameState, MultipartFile image);
}
