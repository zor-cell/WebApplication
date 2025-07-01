package net.zorphy.backend.project.connect4.service;

import net.zorphy.backend.project.connect4.classes.BestMove;
import net.zorphy.backend.project.connect4.classes.Position;
import net.zorphy.backend.project.connect4.classes.Solver;
import net.zorphy.backend.project.connect4.classes.board.SimpleBoard;
import net.zorphy.backend.project.connect4.dto.data.GameState;
import net.zorphy.backend.project.connect4.dto.request.MoveRequest;
import net.zorphy.backend.project.connect4.dto.request.SolveRequest;
import net.zorphy.backend.project.connect4.dto.request.UndoRequest;
import net.zorphy.backend.project.connect4.dto.response.MoveResponse;
import net.zorphy.backend.project.connect4.dto.response.SolveResponse;
import net.zorphy.backend.project.connect4.exception.InvalidOperationException;
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

        return new SolveResponse(board.getBoard(), gameState, position.j, bestMove.score, bestMove.move);
    }

    @Override
    public MoveResponse makeMove(MoveRequest request) {
        SimpleBoard board = new SimpleBoard(request.board(), request.player());

        //get move
        Position move = board.getMoveFromCol(request.move());

        //check for invalid move
        if (move == null) {
            throw new InvalidOperationException("Invalid Move. Column is full");
        }

        //make valid move
        board.makeMove(move.j);

        //compute current game state
        GameState gameState = board.getGameState();

        return new MoveResponse(board.getBoard(), gameState);
    }

    @Override
    public MoveResponse undoMove(UndoRequest request) {
        //does not matter which players turn it is for undo
        SimpleBoard board = new SimpleBoard(request.board(), 1);

        //undo move
        Position move = board.getLastInCol(request.move());
        if (move == null) {
            throw new InvalidOperationException("Invalid Move. Column is empty");
        }

        board.unmakeMove(move);

        //compute current game state (is not really necessary but why not)
        GameState gameState = board.getGameState();

        return new MoveResponse(board.getBoard(), gameState);
    }
}
