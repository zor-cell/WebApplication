package net.zorphy.backend.main.service.game;

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
import net.zorphy.backend.site.all.dto.GameStateBase;
import net.zorphy.backend.site.all.dto.ResultStateBase;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
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

        for(GameSpecificDelete gameDelete : gameDeleteList) {
            gameDeleteMap.put(gameDelete.supportedType(), gameDelete);
        }
    }

    @Override
    public List<GameMetadata> getGames() {
        return mapList(gameRepository.findAll());
    }

    @Override
    public List<GameMetadata> searchGames(GameFilters gameFilters) {
        List<Game> games;
        if(gameFilters == null) {
            games = gameRepository.findAll();
        } else {
            Specification<Game> specs = GameSpecifications.search(gameFilters);
            games = gameRepository.findAll(specs);
        }

        return mapList(games);
    }

    @Override
    public List<GameStats> getStats(GameFilters gameFilters) {
        List<GameStats> gameStats = new ArrayList<>();

        if(gameFilters.players() == null) {
            throw new InvalidOperationException("At least one player has to be selected");
        }
        if(gameFilters.gameTypes() == null || gameFilters.gameTypes().size() != 1) {
            throw new InvalidOperationException("Exactly one game type has to be selected");
        }

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

            GameStats stats = gameStatsUtil.computeStats(playerId, playerFilters.gameTypes().getFirst(), games);
            gameStats.add(stats);
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

        //do game specific actions before delete
        GameSpecificDelete specificDelete = gameDeleteMap.get(GameType.valueOf(game.getGameType()));
        if(specificDelete != null) {
            specificDelete.beforeDelete(game);
        }

        GameDetails gameDetails = gameMapper.gameToGameDetails(game);

        fileStorageService.deleteFile(game.getImageUrl());
        gameRepository.deleteById(id);

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
                        .comparing(GameMetadata::playedAt).reversed()
                        .thenComparing(GameMetadata::duration)
                )
                .collect(Collectors.toList());
    }
}
