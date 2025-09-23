package net.zorphy.backend.site.catan.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.ChartData;
import net.zorphy.backend.main.dto.game.stats.ChartDataEntry;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.service.game.GameSpecificStatsCalculator;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.dto.game.GameStats;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GameStatsCalculator implements GameSpecificStatsCalculator {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GameType supportedType() {
        return GameType.CATAN;
    }

    @Override
    public GameStats compute(PlayerDetails currentPlayer, List<Game> games) {
        Map<Integer, Integer> chartDataMap = new HashMap<>();

        for(Game game : games) {
            try {
                GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);

                TeamDetails playerTeam = gameState.gameConfig().teams().stream()
                        .filter(t -> t.players().contains(currentPlayer))
                        .findFirst().orElse(null);
                assert playerTeam != null;

                for(DiceRoll diceRoll : gameState.diceRolls()) {
                    if(!diceRoll.teamName().equals(playerTeam.name())) continue;

                    int sum = diceRoll.dicePair().sum();
                    chartDataMap.compute(sum, (k, v) -> v == null ? 1 : v + 1);
                }
            } catch(IllegalArgumentException e) {
                //continue if object mapping to game state failed
            }
        }

        ChartData<Integer, Integer> chartData = new ChartData<>(
                chartDataMap.entrySet().stream().map(entry -> new ChartDataEntry<>(
                        entry.getKey(),
                        entry.getValue()
                )).toList()
        );
        return new GameStats(
                chartData
        );
    }
}