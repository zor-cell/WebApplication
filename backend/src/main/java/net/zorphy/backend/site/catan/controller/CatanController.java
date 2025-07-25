package net.zorphy.backend.site.catan.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.GameSessionController;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.service.CatanService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/catan")
public class CatanController extends GameSessionController<GameConfig, GameState> {
    private final CatanService catanService;

    public CatanController(CatanService catanService) {
        super(catanService, GameType.CATAN);
        this.catanService = catanService;
    }

    @PostMapping("dice-roll")
    public GameState rollDice(HttpSession session,
                                  @RequestParam(name = "alchemist", required = false, defaultValue = "false") boolean alchemist) {
        GameState gameState = catanService.rollDice(getSessionState(session), alchemist);
        setSessionState(session, gameState);

        return gameState;
    }
}
