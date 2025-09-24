package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.service.FileStorageService;
import net.zorphy.backend.main.service.game.GameSpecificDelete;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Component;

@Component
public class GameDelete implements GameSpecificDelete {
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;

    public GameDelete(FileStorageService fileStorageService, CustomObjectMapperComponent customObjectMapper) {
        this.fileStorageService = fileStorageService;
        this.objectMapper = customObjectMapper.create();
    }

    @Override
    public GameType supportedType() {
        return GameType.JOLLY;
    }

    @Override
    public void beforeDelete(GameDetails gameDetails) {
        //delete image files saved in rounds
        try {
            GameState gameState = objectMapper.convertValue(gameDetails.gameState(), GameState.class);
            for (RoundInfo round : gameState.rounds()) {
                fileStorageService.deleteFile(round.imageUrl());
            }
        } catch(Exception e) {
            //mapping failed
        }
    }
}
