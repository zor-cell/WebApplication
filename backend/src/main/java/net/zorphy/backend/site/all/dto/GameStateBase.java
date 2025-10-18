package net.zorphy.backend.site.all.dto;

import java.time.Instant;

public interface GameStateBase {
    Instant startTime();
    GameConfigBase gameConfig();
}
