package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.response.GameDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public List<GameDetails> getGames() {
        return gameRepository.findAll()
                .stream()
                .map(gameMapper::gameToGameDetails)
                .collect(Collectors.toList());
    }

    @Override
    public GameDetails saveGame(GameDetails gameDetails) {
        Game toSave = gameMapper.gameDetailsToGame(gameDetails);
        Game saved = gameRepository.save(toSave);
        return gameMapper.gameToGameDetails(saved);
    }
}
