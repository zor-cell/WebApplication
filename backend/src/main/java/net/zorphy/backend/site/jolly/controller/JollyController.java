package net.zorphy.backend.site.jolly.controller;

import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.site.all.GameSessionController;
import net.zorphy.backend.site.all.base.impl.ResultState;
import net.zorphy.backend.site.jolly.dto.game.GameConfig;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import net.zorphy.backend.site.jolly.service.JollyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jolly")
public class JollyController extends GameSessionController<GameConfig, GameState, ResultState> {
    private final JollyService jollyService;

    public JollyController(JollyService jollyService) {
        super(jollyService, GameType.JOLLY);
        this.jollyService = jollyService;
    }
}
