package net.zorphy.backend.site.all.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.time.Instant;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "@class"
)
public interface GameStateBase {
    Instant startTime();
    GameConfigBase gameConfig();
}
