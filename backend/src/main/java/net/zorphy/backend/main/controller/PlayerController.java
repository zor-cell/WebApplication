package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.response.PlayerDetails;
import net.zorphy.backend.main.service.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping()
    public List<PlayerDetails> getPlayers() {
        LOGGER.info("GET /players");

        return playerService.getPlayers();
    }

    @GetMapping("/{name}")
    public PlayerDetails getPlayer(@PathVariable String name) {
        LOGGER.info("GET /players/" + name);

        return playerService.getPlayer(name);
    }

    @PostMapping("/save")
    public PlayerDetails savePlayer(@RequestBody PlayerDetails playerDetails) {
        LOGGER.info("POST /players/save");

        return playerService.savePlayer(playerDetails);
    }
}
