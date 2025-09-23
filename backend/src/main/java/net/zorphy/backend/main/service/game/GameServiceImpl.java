package net.zorphy.backend.main.service.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import net.zorphy.backend.main.dto.game.*;
import net.zorphy.backend.main.dto.game.stats.GameStats;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.entity.Player;
import net.zorphy.backend.main.exception.NotFoundException;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.repository.GameRepository;
import net.zorphy.backend.main.repository.PlayerRepository;
import net.zorphy.backend.main.service.FileStorageService;
import net.zorphy.backend.main.specs.GameSpecifications;
import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.all.base.ResultStateBase;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final GameMapper gameMapper;
    private final FileStorageService fileStorageService;
    private final GameStatsUtil gameStatsUtil;
    private final Map<GameType, GameSpecificDelete> gameDeleteMap = new HashMap<>();

    public GameServiceImpl(GameRepository gameRepository,
                           PlayerRepository playerRepository,
                           GameMapper gameMapper,
                           FileStorageService fileStorageService,
                           GameStatsUtil gameStatsUtil,
                           List<GameSpecificDelete> gameDeleteList) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.gameMapper = gameMapper;
        this.fileStorageService = fileStorageService;
        this.gameStatsUtil = gameStatsUtil;

        for(var gameDelete : gameDeleteList) {
            gameDeleteMap.put(gameDelete.supportedType(), gameDelete);
        }
    }

    @Override
    public List<GameMetadata> getGames() {
        return mapList(gameRepository.findAll());
    }

    @Override
    public List<GameMetadata> searchGames(GameFilters gameFilters) {
        Specification<Game> specs = GameSpecifications.search(gameFilters);
        return mapList(gameRepository.findAll(specs));
    }

    @Override
    public List<GameStats> getStats(GameFilters gameFilters) {
        List<GameStats> gameStats = new ArrayList<>();

        if (gameFilters.players() != null) {
            for (UUID playerId : gameFilters.players()) {
                GameFilters playerFilters = new GameFilters(
                        gameFilters.text(),
                        gameFilters.dateFrom(),
                        gameFilters.dateTo(),
                        gameFilters.minDuration(),
                        gameFilters.maxDuration(),
                        gameFilters.gameTypes(),
                        List.of(playerId)
                );
                Specification<Game> specs = GameSpecifications.search(playerFilters);
                List<Game> games = gameRepository.findAll(specs);

                GameStats stats = gameStatsUtil.computeStats(playerId, games);
                gameStats.add(stats);
            }
        }

        return gameStats;
    }

    @Override
    public GameDetails getGame(UUID id) {
        return gameMapper.gameToGameDetails(getGameInternal(id));
    }

    @Override
    public GameDetails deleteGame(UUID id) {
        Game game = getGameInternal(id);
        GameDetails gameDetails = gameMapper.gameToGameDetails(game);

        //do game specific actions before delete
        GameSpecificDelete specificDelete = gameDeleteMap.get(gameDetails.metadata().gameType());
        if(specificDelete != null) {
            specificDelete.beforeDelete(gameDetails);
        }

        gameRepository.deleteById(id);
        fileStorageService.deleteFile(game.getImageUrl());

        return gameDetails;
    }

    @Override
    public GameDetails saveGame(GameType gameType, GameStateBase gameState, ResultStateBase resultState, MultipartFile image, List<TeamDetails> teams) {
        //get all players in team from db
        Set<Player> players = teams.stream()
                .flatMap(team -> team.players().stream())
                .map(PlayerDetails::name)
                .map(playerRepository::findByName)
                .collect(Collectors.toSet());

        //save image file to file storage
        String path = fileStorageService.saveFile(gameType, image);

        Game toSave = new Game(
                gameState.startTime(),
                Duration.between(gameState.startTime(), Instant.now()),
                gameType.name(),
                path,
                gameState,
                resultState,
                players
        );
        Game saved = gameRepository.save(toSave);
        return gameMapper.gameToGameDetails(saved);
    }

    private Game getGameInternal(UUID id) {
        Optional<Game> game = gameRepository.findById(id);
        if (game.isEmpty()) {
            throw new NotFoundException("Game with id %s not found".formatted(id));
        }

        return game.get();
    }

    private List<GameMetadata> mapList(List<Game> list) {
        return list.
                stream()
                .map(gameMapper::gameToGameMetadata)
                .sorted(Comparator
                        .comparing(GameMetadata::playedAt)
                        .thenComparing(GameMetadata::duration)
                )
                .collect(Collectors.toList());
    }
}
