package net.zorphy.backend.site.jolly.service;

import net.zorphy.backend.main.dto.file.FileStorageFile;
import net.zorphy.backend.site.all.GameSessionSaveService;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface JollyService extends GameSessionSaveService<GameConfig, GameState, ResultState> {
    /**
     * Adds a jolly round to the {@code oldState} and returns the modified state.
     * In the round a temporary {@code imageIdentifier} is save as the image url, so the bytes is
     * only saved on game save
     */
    GameState saveRound(GameState oldState, List<RoundResult> results, UUID imageIdentifier);

    /**
     * Resolves the temporary image identifiers from round saving with their corresponding
     * image from {@code images}
     */
    GameState saveRoundImages(GameState oldState, Map<UUID, FileStorageFile> images);
}
