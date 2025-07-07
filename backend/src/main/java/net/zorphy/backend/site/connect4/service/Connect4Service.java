package net.zorphy.backend.site.connect4.service;

import net.zorphy.backend.site.connect4.dto.request.MoveRequest;
import net.zorphy.backend.site.connect4.dto.request.SolveRequest;
import net.zorphy.backend.site.connect4.dto.request.UndoRequest;
import net.zorphy.backend.site.connect4.dto.response.MoveResponse;
import net.zorphy.backend.site.connect4.dto.response.SolveResponse;

public interface Connect4Service {
    SolveResponse makeBestMove(SolveRequest bestMoveDto);

    MoveResponse makeMove(MoveRequest makeMoveDto);

    MoveResponse undoMove(UndoRequest undoMoveDto);
}
