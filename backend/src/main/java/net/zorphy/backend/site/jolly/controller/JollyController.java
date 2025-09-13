package net.zorphy.backend.site.jolly.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.GameSessionController;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.RoundResult;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import net.zorphy.backend.site.jolly.service.JollyService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/jolly")
public class JollyController extends GameSessionController<GameConfig, GameState, ResultState> {
    private final JollyService jollyService;

    public JollyController(JollyService jollyService) {
        super(jollyService, GameType.JOLLY);
        this.jollyService = jollyService;
    }

    @PostMapping(value = "round", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GameState saveRound(HttpSession session,
                               @RequestPart("results") @Valid List<RoundResult> results,
                               @RequestPart(value = "image", required = false) MultipartFile image) {
        GameState gameState = jollyService.saveRound(getSessionState(session), results, image);
        setSessionState(session, gameState);

        return gameState;
    }
}
