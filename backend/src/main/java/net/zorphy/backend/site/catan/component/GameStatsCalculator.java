package net.zorphy.backend.site.catan.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.dto.game.GameType;
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
    private final ObjectMapper objectMapper;

    public GameStatsCalculator(CustomObjectMapperComponent customObjectMapper) {
        this.objectMapper = customObjectMapper.create();
    }

    @Override
    public GameType supportedType() {
        return GameType.CATAN;
    }

    @Override
    public GameStats compute(PlayerDetails currentPlayer, List<Game> games) {
        List<DiceRoll> diceRolls = new ArrayList<>();

        int gameCount = 0;
        for(Game game : games) {
            try {
                GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);

                TeamDetails playerTeam = gameState.gameConfig().teams().stream()
                        .filter(t -> t.players()
                                .stream()
                                .anyMatch(player -> currentPlayer.id().equals(player.id())))
                        .findFirst().orElse(null);

                //compatibility for early games where no player id was saved
                if(playerTeam == null) {
                    playerTeam = gameState.gameConfig().teams().stream()
                            .filter(t -> t.players()
                                    .stream()
                                    .anyMatch(player -> player.name().equals(currentPlayer.name())))
                            .findFirst()
                            .orElse(null);
                }
                assert playerTeam != null;

                for(DiceRoll diceRoll : gameState.diceRolls()) {
                    if(!diceRoll.teamName().equals(playerTeam.name())) continue;

                    //dice rolls should all be under player name
                    diceRolls.add(new DiceRoll(
                            diceRoll.dicePair(),
                            diceRoll.diceEvent(),
                            currentPlayer.name()
                    ));
                }
                gameCount++;
            } catch(Exception e) {
                int i = 0;
                //continue if object mapping to game state failed
            }
        }

        return new GameStats(
                gameCount,
                diceRolls
        );
    }
}