package net.zorphy.backend.site.all.base;

import java.time.LocalDateTime;

public interface GameStateBase {
    LocalDateTime startTime();
    GameConfigBase gameConfig();
}
