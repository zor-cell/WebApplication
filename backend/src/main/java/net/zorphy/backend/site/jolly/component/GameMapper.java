package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.component.FileUrlComponent;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.service.GameSpecificMapper;
import net.zorphy.backend.site.all.dto.GameStateBase;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("JollyGameMapper")
public class GameMapper implements GameSpecificMapper {
    private final ObjectMapper objectMapper;
    private final FileUrlComponent fileUrlComponent;

    public GameMapper(FileUrlComponent fileUrlComponent, CustomObjectMapperComponent customObjectMapper) {
        this.fileUrlComponent = fileUrlComponent;
        this.objectMapper = customObjectMapper.getMapper();
    }

    @Override
    public GameType supportedType() {
        return GameType.JOLLY;
    }

    @Override
    public GameStateBase mapGameState(GameStateBase gameState) {
        try {
            GameState oldState = objectMapper.convertValue(gameState, GameState.class);

            List<RoundInfo> rounds = new ArrayList<>();
            for (var oldRound : oldState.rounds()) {
                var round = new RoundInfo(
                        oldRound.endTime(),
                        fileUrlComponent.resolveFileUrl(oldRound.imageUrl()),
                        oldRound.results()
                );
                rounds.add(round);
            }

            return new GameState(
                    oldState.startTime(),
                    oldState.gameConfig(),
                    rounds
            );
        } catch(Exception e) {
            //mapping failed
        }

        return gameState;
    }
}
