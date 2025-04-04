package net.zorphy.backend.controller.connect4;

import net.zorphy.backend.dto.connect4.BestMoveDto;
import net.zorphy.backend.dto.connect4.MakeMoveDto;
import net.zorphy.backend.dto.connect4.UndoMoveDto;
import net.zorphy.backend.service.connect4.Connect4Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/connect4")
public class Connect4Controller {
    private final Connect4Service connect4Service;

    public Connect4Controller(Connect4Service connect4Service) {
        this.connect4Service = connect4Service;
    }

    public String makeBestMove(BestMoveDto bestMoveDto) {
        return "bestMove";
    }

    public void makeMove(MakeMoveDto makeMoveDto) {

    }

    public void undoMove(UndoMoveDto undoMoveDto) {

    }
}
