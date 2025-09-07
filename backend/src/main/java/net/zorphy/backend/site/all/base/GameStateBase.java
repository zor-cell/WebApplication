package net.zorphy.backend.site.all.base;

import java.time.Instant;
import java.time.LocalDateTime;

public interface GameStateBase {
    Instant startTime();
    GameConfigBase gameConfig();
}
