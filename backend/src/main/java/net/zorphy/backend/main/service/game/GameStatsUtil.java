package net.zorphy.backend.main.service.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.*;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.all.base.impl.ResultTeamState;
import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.ToDoubleFunction;

@Component
public class GameStatsUtil {
    private final Map<GameType, GameSpecificStatsCalculator> statsCalculatorMap = new HashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GameStatsUtil(List<GameSpecificStatsCalculator> calculators) {
        for(var calc : calculators) {
            statsCalculatorMap.put(calc.supportedType(), calc);
        }
    }

    /**
     * Computes the game stats for a given {@code playerId} and given {@code games}.
     */
    public GameStats computeStats(UUID playerId, GameType gameType, List<Game> games) {
        Map<PlayerDetails, PlayerInfo> opponentMap = new HashMap<>();
        Map<PlayerDetails, PlayerInfo> teammateMap = new HashMap<>();

        List<GameStatsCorrelation<Integer>> startingPositionToWins = new ArrayList<>();
        List<CorrelationDataPoint> startingPositionToScore = new ArrayList<>();

        PlayerDetails currentPlayer = null;
        int gamesPlayed = 0;
        int gamesWon = 0;
        int totalScore = 0;
        int maxScore = 0;

        for (Game game : games) {
            try {
                ResultState result = objectMapper.convertValue(game.getResult(), ResultState.class);

                ResultTeamState playerTeam = result.teams().stream()
                        .filter(team -> team.team().players().stream().anyMatch(p -> p.id().equals(playerId)))
                        .findFirst()
                        .orElse(null);
                assert playerTeam != null;

                currentPlayer = playerTeam.team().players().stream()
                        .filter(p -> playerId.equals(p.id()))
                        .findFirst().orElse(currentPlayer);
                assert currentPlayer != null;

                ResultTeamState winnerTeam = result.teams().stream()
                        .max(Comparator.comparingInt(ResultTeamState::score))
                        .orElse(null);
                assert winnerTeam != null;

                boolean playerIsWinner = winnerTeam.team().players().stream()
                        .anyMatch(p -> playerId.equals(p.id()));

                //update teammates
                for (PlayerDetails teammate : playerTeam.team().players()) {
                    if (!teammate.id().equals(playerId)) {
                        updatePlayerMap(teammateMap, teammate, playerIsWinner);
                    }
                }

                //update opponents
                for (ResultTeamState teamResult : result.teams()) {
                    if (teamResult.equals(playerTeam)) continue;

                    for (PlayerDetails player : teamResult.team().players()) {
                        updatePlayerMap(opponentMap, player, playerIsWinner);
                    }
                }

                //player specific stats
                int curScore = playerTeam.score();
                totalScore += curScore;
                maxScore = Math.max(maxScore, curScore);

                gamesPlayed++;
                if (playerIsWinner) gamesWon++;


                int playerStartPosition = result.teams().indexOf(playerTeam);

                //correlation data
                startingPositionToScore.add(new CorrelationDataPoint(
                   playerStartPosition + 1,
                   curScore,
                   playerIsWinner
                ));
            } catch(Exception e) {
                //continue if object mapping to result failed
            }
        }

        //player has worst win rate against this opponent
        PlayerDetails nemesis = getExtremePlayer(opponentMap, PlayerInfo::getWinRate, false);

        //player has best win rate against this opponent
        PlayerDetails victim = getExtremePlayer(opponentMap, PlayerInfo::getWinRate, true);

        //player has played most against opponent
        PlayerDetails rival = getExtremePlayer(opponentMap, info -> info.gamesPlayed, true);

        //player has played most with teammate
        PlayerDetails companion = getExtremePlayer(teammateMap, info -> info.gamesPlayed, true);

        //game specific stats
        GameSpecificStats gameSpecificStats = null;
        GameSpecificStatsCalculator calc = statsCalculatorMap.get(gameType);
        if(calc != null) {
            gameSpecificStats = calc.compute(currentPlayer, games);
        }

        return new GameStats(
                currentPlayer,
                gamesPlayed,
                computeFraction(gamesWon, gamesPlayed),
                computeFraction(totalScore, gamesPlayed),
                maxScore,
                nemesis,
                victim,
                rival,
                companion,
                computeCorrelation(startingPositionToScore),
                gameSpecificStats
        );
    }

    /**
     * Computes the fraction {@code num} / {@code den}.
     * If {@code den} is 0, 0 is returned.
     */
    public static double computeFraction(int num, int den) {
        if(den == 0) {
            return 0;
        }

        return (double) num / den;
    }

    /**
     * Compute the correlation data for the given {@code points}.
     */
    public static CorrelationResult computeCorrelation(List<CorrelationDataPoint> points) {
        if(points.size() < 2) {
            return new CorrelationResult(
              0,
              0,
              0,
              List.of()
            );
        }

        double[] x = points.stream().mapToDouble(CorrelationDataPoint::x).toArray();
        double[] y = points.stream().mapToDouble(CorrelationDataPoint::y).toArray();

        //correlation
        PearsonsCorrelation cor = new PearsonsCorrelation();
        double coefficient = cor.correlation(x, y);

        // simple regression
        SimpleRegression regression = new SimpleRegression();
        for (CorrelationDataPoint point : points) {
            regression.addData(point.x(), point.y());
        }

        double slope = regression.getSlope();
        double intercept = regression.getIntercept();

        return new CorrelationResult(coefficient, slope, intercept, points);
    }

    private void computeCorrelation(UUID playerId, ResultState result) {

    }

    private static void updatePlayerMap(Map<PlayerDetails, PlayerInfo> map, PlayerDetails player, boolean isWinner) {
        int increment = isWinner ? 1 : 0;
        map.compute(player, (p, info) -> {
            if(info == null) {
                return new PlayerInfo(1, increment);
            }

            return new PlayerInfo(info.gamesPlayed + 1, info.gamesWon + increment);
        });
    }

    private static PlayerDetails getExtremePlayer(Map<PlayerDetails, PlayerInfo> map, ToDoubleFunction<PlayerInfo> metric, boolean max) {
        if (max) {
            return map.entrySet().stream()
                    .max(Comparator.comparingDouble(entry -> metric.applyAsDouble(entry.getValue())))
                    .map(Map.Entry::getKey)
                    .orElse(null);
        }

        return map.entrySet().stream()
                .min(Comparator.comparingDouble(entry -> metric.applyAsDouble(entry.getValue())))
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private static class PlayerInfo {
        //the games the main player has played against the player
        public int gamesPlayed;

        //the games the main player has won against the player
        public int gamesWon;

        public PlayerInfo(int gamesPlayed, int gamesWon) {
            this.gamesPlayed = gamesPlayed;
            this.gamesWon = gamesWon;
        }

        public double getWinRate() {
            if (gamesPlayed == 0) return 0;

            return (double) gamesWon / gamesPlayed;
        }
    }
}
