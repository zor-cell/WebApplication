package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.service.GameService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class JollyServiceImpl implements JollyService {
    private final GameService gameService;

    public JollyServiceImpl(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        return new GameState(
                LocalDateTime.now(),
                gameConfig,
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        return new GameState(
                oldState.startTime(),
                gameConfig,
                oldState.rounds()
        );
    }

    @Override
    public GameDetails saveSession(GameState gameState, ResultState resultState, MultipartFile image) {
        return gameService.saveGame(
                Duration.between(gameState.startTime(), LocalDateTime.now()),
                GameType.JOLLY,
                gameState,
                resultState,
                image,
                gameState.gameConfig().teams()
        );
    }

    @Override
    public GameState undoMove(GameState gameState) {
        return null;
    }
}
