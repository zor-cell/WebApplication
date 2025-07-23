package net.zorphy.backend.site.catan.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.GameSessionController;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.catan.dto.GameConfig;
import net.zorphy.backend.site.catan.dto.GameState;
import net.zorphy.backend.site.catan.dto.ResultState;
import net.zorphy.backend.site.catan.service.CatanService;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
