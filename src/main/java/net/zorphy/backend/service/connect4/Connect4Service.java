package net.zorphy.backend.service.connect4;

import net.zorphy.backend.dto.connect4.request.SolveRequest;
import net.zorphy.backend.dto.connect4.request.MakeMoveRequest;
import net.zorphy.backend.dto.connect4.request.UndoMoveRequest;
import net.zorphy.backend.dto.connect4.response.MoveResponse;
import net.zorphy.backend.dto.connect4.response.SolveResponse;

public interface Connect4Service {
    public SolveResponse makeBestMove(SolveRequest bestMoveDto);

    public MoveResponse makeMove(MakeMoveRequest makeMoveDto);

    public MoveResponse undoMove(UndoMoveRequest undoMoveDto);
}
