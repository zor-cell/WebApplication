package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.util.List;

public interface PlayerService {
    List<PlayerDetails> getPlayers();

    PlayerDetails getPlayer(String name);

    PlayerDetails savePlayer(PlayerDetails playerDetails);
}
