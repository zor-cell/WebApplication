package net.zorphy.backend.connect4.controller;

import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.request.MakeMoveRequest;
import net.zorphy.backend.connect4.dto.request.UndoMoveRequest;
import net.zorphy.backend.connect4.dto.response.MoveResponse;
import net.zorphy.backend.connect4.dto.response.SolveResponse;
import net.zorphy.backend.connect4.service.Connect4Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping("/connect4")
public class Connect4Controller {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final Connect4Service connect4Service;

    public Connect4Controller(Connect4Service connect4Service) {
        this.connect4Service = connect4Service;
    }

    @PostMapping("solve")
    public SolveResponse makeBestMove(SolveRequest solveRequest) {
        LOGGER.info("POST /connect4/solve");
        LOGGER.debug("Body: {}", solveRequest);

        return connect4Service.makeBestMove(solveRequest);
    }

    @PostMapping("move")
    public MoveResponse makeMove(MakeMoveRequest makeMoveRequest) {
        LOGGER.info("POST /connect4/move");
        LOGGER.debug("Body: {}", makeMoveRequest);

        return connect4Service.makeMove(makeMoveRequest);
    }

    @PostMapping("undo")
    public MoveResponse undoMove(UndoMoveRequest undoMoveRequest) {
        LOGGER.info("POST /connect4/undo");
        LOGGER.debug("Body: {}", undoMoveRequest);

        return connect4Service.undoMove(undoMoveRequest);
    }
}
