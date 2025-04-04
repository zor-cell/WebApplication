package net.zorphy.backend.connect4.service.impl;

import net.zorphy.backend.connect4.dto.request.MakeMoveRequest;
import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.request.UndoMoveRequest;
import net.zorphy.backend.connect4.dto.response.MoveResponse;
import net.zorphy.backend.connect4.dto.response.SolveResponse;
import net.zorphy.backend.connect4.service.Connect4Service;
import org.springframework.stereotype.Service;

@Service
public class Connect4ServiceImpl implements Connect4Service {

    @Override
    public SolveResponse makeBestMove(SolveRequest bestMoveDto) {
        return null;
    }

    @Override
    public MoveResponse makeMove(MakeMoveRequest makeMoveDto) {
        return null;
    }

    @Override
    public MoveResponse undoMove(UndoMoveRequest undoMoveDto) {
        return null;
    }
}
