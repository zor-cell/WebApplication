package net.zorphy.backend.site;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.catan.dto.ResultState;
import org.springframework.web.multipart.MultipartFile;

public interface GameSessionService<T, R> {
    R createSession(T config);

    R updateSession(R oldState, T config);

    GameDetails saveSession(R state, ResultState resultState, MultipartFile image);
}
