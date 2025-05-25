package net.zorphy.backend.connect4.service;

import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.request.MoveRequest;
import net.zorphy.backend.connect4.dto.request.UndoRequest;
import net.zorphy.backend.connect4.dto.response.MoveResponse;
import net.zorphy.backend.connect4.dto.response.SolveResponse;

public interface Connect4Service {
    public SolveResponse makeBestMove(SolveRequest bestMoveDto);

    public MoveResponse makeMove(MoveRequest makeMoveDto);

    public MoveResponse undoMove(UndoRequest undoMoveDto);
}
