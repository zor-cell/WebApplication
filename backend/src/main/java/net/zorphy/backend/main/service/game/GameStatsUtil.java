package net.zorphy.backend.main.service.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.dto.game.stats.ChartData;
import net.zorphy.backend.main.dto.game.stats.ChartDataEntry;
import net.zorphy.backend.main.dto.game.stats.GameSpecificStats;
import net.zorphy.backend.main.dto.game.stats.GameStats;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.all.base.impl.ResultTeamState;
import org.springframework.stereotype.Component;

import java.time.Instant;
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
    public GameStats computeStats(UUID playerId, List<Game> games) {
        Map<PlayerDetails, PlayerInfo> opponentMap = new HashMap<>();
        Map<PlayerDetails, PlayerInfo> teammateMap = new HashMap<>();

        PlayerDetails currentPlayer = null;
        int gamesPlayed = 0;
        int gamesWon = 0;
        int totalScore = 0;
        int maxScore = 0;
        ChartData<Instant, Boolean> chartData = new ChartData<>(
                new ArrayList<>()
        );

        for (Game game : games) {
            try {
                ResultState result = objectMapper.convertValue(game.getResult(), ResultState.class);

                ResultTeamState playerTeam = result.teams().stream()
                        .filter(team -> team.team().players().stream().anyMatch(p -> p.id().equals(playerId)))
                        .findFirst()
                        .orElse(null);
                assert playerTeam != null;

                currentPlayer = playerTeam.team().players().stream()
                        .filter(p -> p.id().equals(playerId))
                        .findFirst().orElse(currentPlayer);

                ResultTeamState winnerTeam = result.teams().stream()
                        .max(Comparator.comparingInt(ResultTeamState::score))
                        .orElse(null);
                assert winnerTeam != null;

                boolean playerIsWinner = winnerTeam.team().players().stream()
                        .anyMatch(p -> p.id().equals(playerId));

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

                chartData.entries().add(new ChartDataEntry<>(
                        game.getPlayedAt(),
                        playerIsWinner
                ));
            } catch(IllegalArgumentException e) {
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
        GameSpecificStatsCalculator calc = statsCalculatorMap.get(GameType.CATAN);
        GameSpecificStats gameSpecificStats = null;
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
                0.8f,
                chartData,
                gameSpecificStats
        );
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

    private static float computeFraction(int num, int den) {
        if(den == 0) {
            return 0;
        }

        return (float) num / den;
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
