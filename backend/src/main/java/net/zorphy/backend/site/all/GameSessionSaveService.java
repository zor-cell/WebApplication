package net.zorphy.backend.site.all;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.site.all.base.GameConfigBase;
import net.zorphy.backend.site.all.base.GameStateBase;
import net.zorphy.backend.site.all.base.ResultStateBase;
import org.springframework.web.multipart.MultipartFile;

/**
 * An extension of the basic session management that includes game session saving
 */
public interface GameSessionSaveService<Config extends GameConfigBase, State extends GameStateBase, Result extends ResultStateBase> extends GameSessionBaseService<Config, State> {
    GameDetails saveSession(State state, Result resultState, MultipartFile image);
}
