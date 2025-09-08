package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.entity.Player;
import net.zorphy.backend.main.exception.NotFoundException;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.repository.GameRepository;
import net.zorphy.backend.main.repository.PlayerRepository;
import net.zorphy.backend.main.specs.GameSpecifications;
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

    public GameServiceImpl(GameRepository gameRepository, PlayerRepository playerRepository, GameMapper gameMapper, FileStorageService fileStorageService) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.gameMapper = gameMapper;
        this.fileStorageService = fileStorageService;
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
    public GameDetails getGame(UUID id) {
        return gameMapper.gameToGameDetails(getGameInternal(id));
    }

    @Override
    public GameDetails deleteGame(UUID id) {
        Game game = getGameInternal(id);
        GameDetails gameDetails = gameMapper.gameToGameDetails(game);

        gameRepository.deleteById(id);
        fileStorageService.deleteFile(game.getImageUrl());

        return gameDetails;
    }

    @Override
    public GameDetails saveGame(Duration duration, GameType gameType, Object gameState, Object resultState, MultipartFile image, List<TeamDetails> teams) {
        //get all players in team from db
        Set<Player> players = teams.stream()
                .flatMap(team -> team.players().stream())
                .map(PlayerDetails::name)
                .map(playerRepository::findByName)
                .collect(Collectors.toSet());

        //save image file to file storage
        String path = fileStorageService.saveFile(gameType, image);

        Game toSave = new Game(
                Instant.now(),
                duration,
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
        if(game.isEmpty()) {
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
