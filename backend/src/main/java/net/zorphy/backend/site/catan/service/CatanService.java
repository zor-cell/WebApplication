package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.GameSessionService;
import net.zorphy.backend.site.catan.dto.GameConfig;
import net.zorphy.backend.site.catan.dto.GameState;
import net.zorphy.backend.site.catan.dto.ResultState;
import org.springframework.web.multipart.MultipartFile;

public interface CatanService extends GameSessionService<GameConfig, GameState> {
    GameState rollDice(GameState gameState, boolean isAlchemist);
}