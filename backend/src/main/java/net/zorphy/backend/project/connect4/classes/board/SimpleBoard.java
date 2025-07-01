package net.zorphy.backend.project.connect4.classes.board;

import net.zorphy.backend.project.connect4.classes.Position;
import net.zorphy.backend.project.connect4.classes.Scores;
import net.zorphy.backend.project.connect4.dto.data.GameState;

public class SimpleBoard implements Board {
    public final int rows;
    public final int cols;
    private int player;
    private int moves = 0;

    private final int[][] board;

    public SimpleBoard(SimpleBoard simpleBoard) {
        this.rows = simpleBoard.rows;
        this.cols = simpleBoard.cols;
        this.player = simpleBoard.player;
        this.moves = simpleBoard.moves;

        this.board = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            System.arraycopy(simpleBoard.board[i], 0, this.board[i], 0, cols);
        }
    }

    public SimpleBoard(int[][] board, int player) {
        this.rows = board.length;
        this.cols = board[0].length;
        this.player = player;

        this.board = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (board[i][j] != 0) {
                    moves++;
                }

                this.board[i][j] = board[i][j];
            }
        }
    }

    public static void main(String[] args) {
        int[][] board = {
                //0, 1, 2, 3, 4, 5, 6
                {0, 0, 0, 0, 0, 0, 0},   //0
                {0, 0, 0, 0, 0, 0, 0},   //1
                {0, 0, 1, 0, 0, 0, 0},   //2
                {0, 0, -1, 0, 0, 0, 0},   //3
                {0, 0, -1, -1, 1, 0, 0}, //4
                {0, 0, -1, 1, 1, 1, 0},   //5
                //0, 1, 2, 3, 4, 5, 6
        };

        Board simpleBoard = new SimpleBoard(board, -1);

        System.out.println(simpleBoard.heuristics());
        System.out.println(simpleBoard.isWinningMove(3));
    }

    @Override
    public boolean canMakeMove(int col) {
        Position move = getMoveFromCol(col);
        return move != null;
    }

    @Override
    public boolean isWinningMove(int col) {
        if (!canMakeMove(col)) return false;

        Position move = getMoveFromCol(col);
        int[][] dirs = {
                {1, 0}, //vertical down
                {0, 1}, //horizontal right
                {1, 1}, //diagonal down right
                {1, -1}, //diagonal down left
        };

        for (int[] dir : dirs) {
            int count = 0;
            //check direction
            for (int k = 1; k < 4; k++) {
                Position next = new Position(move.i + dir[0] * k, move.j + dir[1] * k);
                if (!next.isInBounds(rows, cols)) break;
                if (board[next.i][next.j] != player) break;

                count++;
            }

            //check inverse direction
            int[] inv = {dir[0] * -1, dir[1] * -1};
            for (int k = 1; k < 4; k++) {
                Position next = new Position(move.i + inv[0] * k, move.j + inv[1] * k);
                if (!next.isInBounds(rows, cols)) break;
                if (board[next.i][next.j] != player) break;

                count++;
            }

            if (count >= 3) return true;
        }

        return false;
    }

    @Override
    public void makeMove(int col) {
        Position move = getMoveFromCol(col);
        assert move != null;

        board[move.i][move.j] = player;
        moves++;
        player *= -1;
    }

    @Override
    public GameState getGameState() {
        //check for win
        int[][] dirs = {
                {1, 0}, //vertical
                {0, 1}, //horizontal
                {1, 1}, //diagonal down
                {1, -1} //diagonal up
        };

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                int cur = board[i][j];
                if (cur == 0) continue;

                for (int[] dir : dirs) {
                    //check 4 in a row
                    int countPlayer = 1;
                    for (int k = 1; k < 4; k++) {
                        Position next = new Position(i + dir[0] * k, j + dir[1] * k);
                        if (!next.isInBounds(rows, cols)) break;

                        if (board[next.i][next.j] == cur) {
                            countPlayer++;
                        }
                    }

                    if (countPlayer == 4) {
                        return cur == 1 ? GameState.PLAYER1 : GameState.PLAYER2;
                    }
                }
            }
        }

        //check for draw
        boolean draw = true;
        for (int j = 0; j < cols; j++) {
            if (board[0][j] == 0) {
                draw = false;
                break;
            }
        }
        if (draw) return GameState.DRAW;

        return GameState.RUNNING;
    }

    @Override
    public int getMoves() {
        return moves;
    }

    @Override
    public int getColumns() {
        return cols;
    }

    @Override
    public long getHash() {
        //transposition table is not used for simple board
        return 0;
    }

    @Override
    public int heuristics() {
        int score = 0;
        for (int player : new int[]{-1, 1}) {
            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < cols; j++) {
                    //direction is important since no empty can be below v, dl and dr
                    int[][] dirs = {
                            {-1, 0}, //vertical v
                            {0, 1}, //horizontal h
                            {-1, -1}, //diagonal left dl
                            {-1, 1} //diagonal right dr
                    };

                    for (int[] dir : dirs) {
                        int countPlayer = 0;
                        int countEmpty = 0;
                        for (int k = 0; k <= 3; k++) {
                            Position next = new Position(i + dir[0] * k, j + dir[1] * k);
                            if (!next.isInBounds(rows, cols)) break;

                            if (board[next.i][next.j] == player) {
                                countPlayer++;
                            } else if (board[next.i][next.j] == 0) {
                                countEmpty++;
                            }
                        }

                        if (countPlayer == 4) {
                            //4 in a row
                            score += player * 1000;
                        } else if (countPlayer == 3 && countEmpty == 1) {
                            //3 in row with 1 empty somewhere between
                            score += player * Scores.THREE_IN_ROW;
                        } else if (countPlayer == 2 && countEmpty == 2) {
                            //2 in row with 2 empties somewhere between
                            score += player * Scores.TWO_IN_ROW;
                        }
                    }
                }
            }
        }

        return score * player;
    }

    public int[][] getBoard() {
        return board;
    }

    public Position getMoveFromCol(int col) {
        int i = board.length - 1;
        while (i >= 0 && board[i][col] != 0) {
            i--;
        }
        if (i >= 0) {
            return new Position(i, col);
        }

        return null;
    }

    public Position getLastInCol(int col) {
        int i = 0;
        while (i < board.length && board[i][col] == 0) {
            i++;
        }
        if (i < board.length) {
            return new Position(i, col);
        }

        return null;
    }

    public void unmakeMove(Position move) {
        board[move.i][move.j] = 0;
        moves--;
        player *= -1;
    }
}
