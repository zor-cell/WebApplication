package net.zorphy.backend.site.all;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.all.base.GameConfigBase;
import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.all.base.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

public interface GameSessionService<Config extends GameConfigBase, State extends GameStateBase, Result extends ResultStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);

    GameDetails saveSession(State state, Result resultState, MultipartFile image);

    State undoMove(State state);
}
