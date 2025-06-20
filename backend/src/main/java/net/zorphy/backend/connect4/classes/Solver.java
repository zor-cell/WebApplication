package net.zorphy.backend.connect4.classes;


import net.zorphy.backend.connect4.classes.board.Board;
import net.zorphy.backend.connect4.classes.table.TableEntry;
import net.zorphy.backend.connect4.classes.table.TableFlag;
import net.zorphy.backend.connect4.classes.table.TranspositionTable;
import net.zorphy.backend.connect4.dto.data.GameState;
import net.zorphy.backend.connect4.dto.data.Version;
import net.zorphy.backend.connect4.dto.request.SolveRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solver extends Thread {
    private final SolveRequest config;
    private long startTime;
    private int nodesVisited = 0;
    private int tableStored = 0;


    private final boolean useTable;
    private final TranspositionTable table;
    private BestMove prevBestMove;
    private BestMove bestMove;

    public Solver(SolveRequest request) {
        this.config = request;

        if(config.version() == Version.V2_1) {
            useTable = true;
            table = new TranspositionTable(Math.max(request.tableSize(), 0));
        } else {
            useTable = false;
            table = null;
        }
    }

    public static void main(String[] args) {
        int[][] board = {
                //0, 1, 2, 3, 4, 5, 6
                {0, 0, 0, 0, 0, 0, 0},   //0
                {0, 0, 0, 0, 0, 0, 0},   //1
                {0, 0, 0, 0, 0, 0, 0},   //2
                {0, 0, 0, 0, 0, 0, 0},   //3
                {0, 0, 0, 0, 0, 0, 0}, //4
                {0, 0, 0, 0, 0, 0, 0},   //5
                //0, 1, 2, 3, 4, 5, 6
        };

        //with time = 5000, depth = 11
        SolveRequest request = new SolveRequest(board, 1, 20000, -1, 64, Version.V2_1);
        BestMove bestMove = startSolver(request);
        System.out.println(bestMove);

        //TODO: add symmetry detection to tranposition table
    }

    public static BestMove startSolver(SolveRequest request) {
        System.out.println("Starting Solver!");

        Solver solverThread = new Solver(request);
        solverThread.start();

        try {
            solverThread.join();
        } catch(InterruptedException e) {
            System.out.println("Main Thread interrupted");
        }
        //System.out.println("Nodes looked up in Transposition table: " + String.format("%,d", solverThread.tableStored));
        //System.out.println("Nodes visited: " + String.format("%,d", solverThread.nodesVisited));

        return solverThread.getBestMove();
    }

    public BestMove getBestMove() {
        return bestMove;
    }

    @Override
    public void run() {
        int depth = 1;
        try {
            startTime = System.currentTimeMillis();

            //copy board instance because on interrupt, board can be in any state
            Board board = Board.getInstance(config);
            assert board != null;

            //iterative deepening
            int maxDepth = config.maxDepth() >= 1 ? config.maxDepth() : 42 - board.getMoves();
            for(depth = 1;depth <= maxDepth;depth++) {
                //the best move score is > 0 when favorable for config.player (no matter which player)
                prevBestMove = negamax(board, depth, Integer.MIN_VALUE, Integer.MAX_VALUE);

                bestMove = prevBestMove;
            }

            System.out.println("Solver Thread finished normally. Reached depth " + maxDepth + "!");
        } catch(InterruptedException e) {
            System.out.println("Solver Thread interrupted. Reached depth " + (depth - 1) + "!");
        }
    }

    private BestMove negamax(Board board, int depth, int alpha, int beta) throws InterruptedException {
        int alphaOrigin = alpha;

        //break out of computation when max thinking time is surpassed
        if(config.maxTime() >= 0 && System.currentTimeMillis() - startTime > config.maxTime()) {
            throw new InterruptedException();
        }

        //transposition table lookup
        if(useTable) {
            TableEntry storedEntry = table.get(board.getHash());
            if (storedEntry != null && storedEntry.depth >= depth) {
                tableStored++;

                if (storedEntry.flag == TableFlag.EXACT) {
                    return storedEntry.bestMove;
                } else if (storedEntry.flag == TableFlag.LOWER_BOUND) {
                    alpha = Math.max(alpha, storedEntry.bestMove.score);
                } else if (storedEntry.flag == TableFlag.UPPER_BOUND) {
                    beta = Math.min(beta, storedEntry.bestMove.score);
                }

                if (alpha >= beta) {
                    return storedEntry.bestMove;
                }
            }
        }

        nodesVisited++;

        //check if player can easily win on next move and instantly make move
        for(int move = 0;move < board.getColumns();move++) {
            if(board.isWinningMove(move)) {
                return new BestMove(move, Scores.WIN - board.getMoves(), 0);
            }
        }

        //check if search or game is over
        GameState gameState = board.getGameState();
        if(depth == 0 || gameState != GameState.RUNNING) {
            int score = board.heuristics();
            return new BestMove(null, score);
        }

        //go through children positions
        BestMove bestMove = new BestMove(null, Integer.MIN_VALUE, -1);
        for(Integer move : getPossibleMoves(board)) {
            Board moveBoard = Board.getInstance(board);
            assert moveBoard != null;
            moveBoard.makeMove(move);

            BestMove child = negamax(moveBoard, depth - 1, invert(beta), invert(alpha));
            int score = -child.score;
            int winDistance = child.winDistance;

            //update best move
            if(score > bestMove.score) {
                //add randomness on equally good moves
                //boolean update = score > bestMove.score || Math.random() < 0.05;

                bestMove.move = move;
                bestMove.score = score;
                if (winDistance >= 0 && (score >= Scores.WIN - 50 || score <= -Scores.WIN + 50)) {
                    bestMove.winDistance = winDistance + 1;
                }
            }

            //alpha-beta pruning
            alpha = Math.max(alpha, score);
            if(alpha >= beta) {
                break;
            }
        }

        //save result to transposition table
        if(useTable) {
            TableFlag flag = TableFlag.EXACT;
            if (bestMove.score <= alphaOrigin) {
                flag = TableFlag.UPPER_BOUND;
            } else if (bestMove.score >= beta) {
                flag = TableFlag.LOWER_BOUND;
            }
            TableEntry saveEntry = new TableEntry(board.getHash(), depth, flag, bestMove);
            table.put(saveEntry);
        }

        return bestMove;
    }

    private List<Integer> getPossibleMoves(Board board) {
        List<Integer> moves = new ArrayList<>();

        //order columns for better pruning
        Integer[] orderedCols = {3, 2, 4, 1, 5, 0, 6};

        //search best move from previous iteration first
        if(prevBestMove != null) {
            Arrays.sort(orderedCols, (a, b) -> {
                if(a.equals(prevBestMove.move)) return -1;
                if(b.equals(prevBestMove.move)) return 1;

                return 0;
            });

            //previous move should only be looked at in first iteration
            prevBestMove = null;
        }

        //add valid moves
        for(int j : orderedCols) {
            if(board.canMakeMove(j)) {
                moves.add(j);
            }
        }

        return moves;
    }

    //separate function due to asymmetric bounds
    private static int invert(int a) {
        if(a == Integer.MIN_VALUE) {
            return Integer.MAX_VALUE;
        } else if(a == Integer.MAX_VALUE) {
            return Integer.MIN_VALUE;
        }

        return -a;
    }
}