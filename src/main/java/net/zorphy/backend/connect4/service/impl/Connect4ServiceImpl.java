package net.zorphy.backend.connect4.service.impl;

import net.zorphy.backend.connect4.classes.BestMove;
import net.zorphy.backend.connect4.classes.Position;
import net.zorphy.backend.connect4.classes.Solver;
import net.zorphy.backend.connect4.classes.board.SimpleBoard;
import net.zorphy.backend.connect4.dto.request.MakeMoveRequest;
import net.zorphy.backend.connect4.dto.request.SolveRequest;
import net.zorphy.backend.connect4.dto.request.UndoMoveRequest;
import net.zorphy.backend.connect4.dto.response.MoveResponse;
import net.zorphy.backend.connect4.dto.response.SolveResponse;
import net.zorphy.backend.connect4.enums.GameState;
import net.zorphy.backend.connect4.service.Connect4Service;
import org.springframework.stereotype.Service;

@Service
public class Connect4ServiceImpl implements Connect4Service {

    @Override
    public SolveResponse makeBestMove(SolveRequest request) {
        SimpleBoard board = new SimpleBoard(request.board(), request.player());

        //get best move
        BestMove bestMove = Solver.startSolver(request);
        Position position = board.getMoveFromCol(bestMove.move);
        assert position != null;

        //make best move
        board.makeMove(position.j);

        //compute current game state
        GameState gameState = board.getGameState();

        return new SolveResponse(board.getBoard(), gameState, position, bestMove.score, bestMove.move);
    }

    @Override
    public MoveResponse makeMove(MakeMoveRequest request) {
        SimpleBoard board = new SimpleBoard(request.board(), request.player());

        //get move
        Position move = board.getMoveFromCol(request.move().j);

        //check for invalid move
        if(move == null) {
            return new MoveResponse(request.board(), null, GameState.RUNNING);
        }

        //make valid move
        board.makeMove(move.j);

        //compute current game state
        GameState gameState = board.getGameState();

        return new MoveResponse(board.getBoard(), move, gameState);
    }

    @Override
    public MoveResponse undoMove(UndoMoveRequest request) {
        //does not matter which players turn it is for undo
        SimpleBoard board = new SimpleBoard(request.board(), 1);

        //undo move
        board.unmakeMove(request.move());

        //compute current game state (is not really necessary but why not)
        GameState gameState = board.getGameState();

        return new MoveResponse(board.getBoard(), request.move(), gameState);
    }
}
