package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.CorrelationResult;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.service.game.GameSpecificStatsCalculator;
import net.zorphy.backend.main.service.game.GameStatsUtil;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import net.zorphy.backend.site.jolly.dto.game.GameStats;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("JollyGameStatsCalculator")
public class GameStatsCalculator implements GameSpecificStatsCalculator {
    private final ObjectMapper objectMapper;

    public GameStatsCalculator(CustomObjectMapperComponent customObjectMapper) {
        this.objectMapper = customObjectMapper.create();
    }

    @Override
    public GameType supportedType() {
        return GameType.JOLLY;
    }

    @Override
    public GameStats compute(PlayerDetails currentPlayer, List<Game> games, List<CorrelationResult> correlations) {
        int roundsPlayed = 0;
        int totalScores = 0;
        int maxScore = 0;
        int outInOneCount = 0;
        int closedCount = 0;

        for(Game game : games) {
            try {
                GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);

                TeamDetails playerTeam = gameState.gameConfig().teams().stream()
                        .filter(t -> t.players()
                                .stream()
                                .anyMatch(player -> currentPlayer.id().equals(player.id())))
                        .findFirst().orElse(null);
                assert playerTeam != null;

                for(var round : gameState.rounds()) {
                    RoundResult result = round.results()
                            .stream()
                            .filter(r -> r.team().players().stream().anyMatch(player -> currentPlayer.id().equals(player.id())))
                            .findFirst()
                            .orElse(null);
                    assert result != null;

                    if(result.outInOne()) {
                        outInOneCount++;
                    }
                    if(result.hasClosed()) {
                        closedCount++;
                    }

                    maxScore = Math.max(maxScore, result.score());
                    totalScores += result.score();
                    roundsPlayed++;
                }
            } catch(Exception e) {
                //continue if object mapping to game state failed
            }
        }

        return new GameStats(
                roundsPlayed,
                GameStatsUtil.computeFraction(totalScores, roundsPlayed),
                maxScore,
                GameStatsUtil.computeFraction(outInOneCount, roundsPlayed),
                GameStatsUtil.computeFraction(closedCount, roundsPlayed)
        );
    }
}
