package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.jolly.dto.RoundInfo;

import java.time.LocalDateTime;
import java.util.List;

public record GameState(
    LocalDateTime startTime,
    GameConfig gameConfig,
    List<RoundInfo> rounds
) implements GameStateBase {
}
