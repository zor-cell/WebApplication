package net.zorphy.backend.connect4.service;

import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.request.MakeMoveRequest;
import net.zorphy.backend.connect4.dto.request.UndoMoveRequest;
import net.zorphy.backend.connect4.dto.response.MoveResponse;
import net.zorphy.backend.connect4.dto.response.SolveResponse;

public interface Connect4Service {
    public SolveResponse makeBestMove(SolveRequest bestMoveDto);

    public MoveResponse makeMove(MakeMoveRequest makeMoveDto);

    public MoveResponse undoMove(UndoMoveRequest undoMoveDto);
}
