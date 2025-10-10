package net.zorphy.backend.site.all;

import net.zorphy.backend.site.all.base.GameConfigBase;
import net.zorphy.backend.site.all.base.GameStateBase;

/**
 * The base service for game session management
 */
public interface GameSessionBaseService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);
}
