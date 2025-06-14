package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.PlayerDetails;
import net.zorphy.backend.main.entity.Player;
import net.zorphy.backend.main.exception.NotFoundException;
import net.zorphy.backend.main.mapper.PlayerMapper;
import net.zorphy.backend.main.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;

    public PlayerServiceImpl(PlayerRepository playerRepository, PlayerMapper playerMapper) {
        this.playerRepository = playerRepository;
        this.playerMapper = playerMapper;
    }

    @Override
    public List<PlayerDetails> getPlayers() {
        return playerRepository.findAll()
                .stream()
                .map(playerMapper::playerToPlayerDetails)
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDetails getPlayer(String name) {
        Player player = playerRepository.findByName(name);
        if(player == null) {
            throw new NotFoundException(String.format("Player with name %s not found", name));
        }

        return playerMapper.playerToPlayerDetails(player);
    }

    @Override
    public PlayerDetails savePlayer(PlayerDetails playerDetails) {
        Player toSave = playerMapper.playerDetailsToPlayer(playerDetails);
        Player saved = playerRepository.save(toSave);
        return playerMapper.playerToPlayerDetails(saved);
    }
}
