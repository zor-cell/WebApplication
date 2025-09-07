package net.zorphy.backend.site.all.base;

import java.time.Instant;

public interface GameStateBase {
    Instant startTime();
    GameConfigBase gameConfig();
}
