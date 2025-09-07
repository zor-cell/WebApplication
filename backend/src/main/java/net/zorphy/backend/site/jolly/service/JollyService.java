package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.site.all.GameSessionService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JollyService extends GameSessionService<GameConfig, GameState, ResultState> {
    GameState saveRound(GameState oldState, List<RoundResult> results, MultipartFile image);
}
