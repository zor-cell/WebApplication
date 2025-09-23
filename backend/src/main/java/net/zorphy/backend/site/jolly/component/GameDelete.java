package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

    public GameDelete(FileStorageService fileStorageService, ObjectMapper objectMapper) {
        this.fileStorageService = fileStorageService;
        this.objectMapper = objectMapper;
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
        } catch(IllegalArgumentException e) {
            //mapping failed
        }
    }
}
