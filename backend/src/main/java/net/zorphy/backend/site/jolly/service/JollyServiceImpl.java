package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.service.FileStorageService;
import net.zorphy.backend.main.service.GameService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JollyServiceImpl implements JollyService {
    private final GameService gameService;
    private final FileStorageService fileStorageService;

    public JollyServiceImpl(GameService gameService, FileStorageService fileStorageService) {
        this.gameService = gameService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        return new GameState(
                Instant.now(),
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
                Duration.between(gameState.startTime(), Instant.now()),
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

    @Override
    public GameState saveRound(GameState oldState, List<RoundResult> results, MultipartFile image) {
        List<RoundInfo> rounds = new ArrayList<>(oldState.rounds());

        if(!oldState.gameConfig().noRoundLimit() && rounds.size() >= oldState.gameConfig().roundLimit()) {
            throw new InvalidOperationException("Maximum number of rounds reached");
        }

        //save image file to file storage
        String path = fileStorageService.saveFile(GameType.JOLLY, image);

        RoundInfo roundInfo = new RoundInfo(
                LocalDateTime.now(),
                path,
                results
        );
        rounds.add(roundInfo);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                rounds
        );
    }
}
