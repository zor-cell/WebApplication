package net.zorphy.backend.site;

import java.time.LocalDateTime;

public interface GameStateBase {
    LocalDateTime startTime();
    GameConfigBase gameConfig();
}
