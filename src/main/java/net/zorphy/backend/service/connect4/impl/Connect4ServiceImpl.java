package net.zorphy.backend.service.connect4.impl;

import net.zorphy.backend.dto.connect4.request.MakeMoveRequest;
import net.zorphy.backend.dto.connect4.request.SolveRequest;
import net.zorphy.backend.dto.connect4.request.UndoMoveRequest;
import net.zorphy.backend.dto.connect4.response.MoveResponse;
import net.zorphy.backend.dto.connect4.response.SolveResponse;
import net.zorphy.backend.service.connect4.Connect4Service;
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
