package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.exception.NotFoundException;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    public GameServiceImpl(GameRepository gameRepository, GameMapper gameMapper) {
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
    }

    @Override
    public List<GameMetadata> getGames() {
        return gameRepository.findAll()
                .stream()
                .map(gameMapper::gameToGameMetadata)
                .collect(Collectors.toList());
    }

    @Override
    public GameDetails getGame(UUID id) {
        Optional<Game> game = gameRepository.findById(id);
        if(game.isEmpty()) {
            throw new NotFoundException("Game with id %s not found".formatted(id));
        }

        return gameMapper.gameToGameDetails(game.get());
    }

    @Override
    public GameDetails saveGame(GameDetails gameDetails) {
        return null;
        /*Game toSave = gameMapper.gameDetailsToGame(gameDetails);
        Game saved = gameRepository.save(toSave);
        return gameMapper.gameToGameDetails(saved);*/
    }
}
