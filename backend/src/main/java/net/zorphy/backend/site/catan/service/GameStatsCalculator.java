package net.zorphy.backend.site.catan.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.service.game.GameSpecificStatsCalculator;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.dto.game.GameStats;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class GameStatsCalculator implements GameSpecificStatsCalculator {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GameType supportedType() {
        return GameType.CATAN;
    }

    @Override
    public GameStats compute(UUID playerId, List<Game> games) {
        for(Game game : games) {
            try {
                GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);
            } catch(IllegalArgumentException e) {
                //continue if object mapping to game state failed
            }
        }

        return new GameStats(
                List.of(1, 2, 3)
        );
    }
}