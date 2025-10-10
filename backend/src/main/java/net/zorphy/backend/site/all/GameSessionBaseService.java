package net.zorphy.backend.site.all;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.all.base.GameConfigBase;
import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.all.base.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

/**
 * The base service for game session management
 */
public interface GameSessionBaseService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);

    State undoMove(State state);
}
