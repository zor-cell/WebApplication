package net.zorphy.backend.site;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.catan.dto.result.ResultState;
import org.springframework.web.multipart.MultipartFile;

public interface GameSessionService<Config extends GameConfigBase, State extends GameStateBase> {
    State createSession(Config config);

    State updateSession(State oldState, Config config);

    GameDetails saveSession(State state, ResultState resultState, MultipartFile image);

    State undoMove(State state);
}
