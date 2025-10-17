package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.CorrelationResult;
import net.zorphy.backend.main.dto.game.stats.LinkedGameStats;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.service.game.GameSpecificStatsCalculator;
import net.zorphy.backend.main.service.game.GameStatsUtil;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import net.zorphy.backend.site.jolly.dto.game.GameStats;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component("JollyGameStatsCalculator")
public class GameStatsCalculator implements GameSpecificStatsCalculator {
    private final ObjectMapper objectMapper;

    public GameStatsCalculator(CustomObjectMapperComponent customObjectMapper) {
        this.objectMapper = customObjectMapper.getMapper();
    }

    @Override
    public GameType supportedType() {
        return GameType.JOLLY;
    }

    @Override
    public GameStats compute(PlayerDetails currentPlayer, List<Game> games, List<CorrelationResult> correlations) {
        int roundsPlayed = 0;
        int roundsWon = 0;

        int totalScores = 0;
        LinkedGameStats<Integer> minScore = new LinkedGameStats<>(
                null,
                Integer.MAX_VALUE
        );
        LinkedGameStats<Integer> maxScore = new LinkedGameStats<>(
                null,
                Integer.MIN_VALUE
        );

        long totalDuration = 0;
        LinkedGameStats<Duration> minDuration = new LinkedGameStats<>(
                null,
                Duration.ofSeconds(Long.MAX_VALUE)
        );
        LinkedGameStats<Duration> maxDuration = new LinkedGameStats<>(
                null,
                Duration.ZERO
        );


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

                for(int i = 0;i < gameState.rounds().size();i++) {
                    RoundInfo round = gameState.rounds().get(i);

                    RoundResult result = round.results()
                            .stream()
                            .filter(r -> r.team().players().stream().anyMatch(player -> currentPlayer.id().equals(player.id())))
                            .findFirst()
                            .orElse(null);
                    assert result != null;

                    var roundMaxScore = round.results().stream()
                            .mapToInt(RoundResult::score)
                            .max().orElse(0);

                    if(result.outInOne()) {
                        outInOneCount++;
                    }
                    if(result.hasClosed()) {
                        closedCount++;
                    }

                    //score data
                    int curScore = result.score();
                    if(curScore < minScore.value()) {
                        minScore = new LinkedGameStats<>(
                                game.getId(),
                                curScore
                        );
                    }
                    if(curScore > maxScore.value()) {
                        maxScore = new LinkedGameStats<>(
                                game.getId(),
                                curScore
                        );
                    }
                    totalScores += result.score();

                    //duration data
                    Duration curDuration;
                    if(i > 0) {
                        var prevTime = gameState.rounds().get(i - 1).endTime();
                        curDuration = Duration.between(prevTime, round.endTime());
                    } else {
                        curDuration = Duration.between(gameState.startTime(), round.endTime());
                    }

                    if(curDuration.compareTo(minDuration.value()) < 0) {
                        minDuration = new LinkedGameStats<>(
                                game.getId(),
                                curDuration
                        );
                    }
                    if(curDuration.compareTo(maxDuration.value()) > 0) {
                        maxDuration = new LinkedGameStats<>(
                                game.getId(),
                                curDuration
                        );
                    }
                    totalDuration += curDuration.getSeconds();


                    roundsPlayed++;
                    if(curScore == roundMaxScore) {
                        roundsWon++;
                    }
                }
            } catch(Exception e) {
                //continue if object mapping to game state failed
            }
        }

        return new GameStats(
                roundsPlayed,
                GameStatsUtil.computeFraction(roundsWon, roundsPlayed),
                minScore,
                GameStatsUtil.computeFraction(totalScores, roundsPlayed),
                maxScore,
                minDuration,
                Duration.ofSeconds((long) GameStatsUtil.computeFraction(totalDuration, roundsPlayed)),
                maxDuration,
                GameStatsUtil.computeFraction(outInOneCount, roundsPlayed),
                GameStatsUtil.computeFraction(closedCount, roundsPlayed)
        );
    }
}
