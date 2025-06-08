package net.zorphy.backend.catan.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.catan.dto.data.GameConfig;
import net.zorphy.backend.catan.dto.data.GameState;
import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.response.SolveResponse;
import net.zorphy.backend.main.exception.InvalidSessionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;

@RestController
@RequestMapping("/catan")
public class CatanController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @PostMapping("solve")
    public SolveResponse solve(@RequestBody SolveRequest solveRequest) {
        LOGGER.info("POST /connect4/solve");

        return null;
    }

    private GameState getSessionState(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute("gameState");
        if(gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }

    private GameState createSessionState(HttpSession session, GameConfig gameConfig) {
        GameState gameState = (GameState) session.getAttribute("gameState");
        if(gameState == null) {
            gameState = new GameState(gameConfig, new ArrayList<>());
        }

        return gameState;
    }

}
