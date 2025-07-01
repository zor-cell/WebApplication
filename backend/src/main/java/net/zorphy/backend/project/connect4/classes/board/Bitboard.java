package net.zorphy.backend.project.connect4.classes.board;

import net.zorphy.backend.project.connect4.classes.Scores;
import net.zorphy.backend.project.connect4.dto.data.GameState;

public class Bitboard implements Board {
    public final int rows;
    public final int cols;
    private int player;
    private int moves = 0;

    private long currentPlayer = 0L;
    private long allPlayers = 0L;

    public Bitboard(Bitboard bitboard) {
        this.rows = bitboard.rows;
        this.cols = bitboard.cols;
        this.currentPlayer = bitboard.currentPlayer;
        this.allPlayers = bitboard.allPlayers;
        this.moves = bitboard.moves;
        this.player = bitboard.player;
    }

    public Bitboard(int[][] board, int player) {
        this.rows = board.length;
        this.cols = board[0].length;
        this.player = player;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (board[i][j] == 0) {
                    continue;
                }

                long pos = 1L << (rows - 1 - i) << (rows + 1) * j;
                if (board[i][j] == player) {
                    currentPlayer |= pos;
                }
                allPlayers |= pos;
                moves++;
            }
        }
    }

    public static void main(String[] args) {
        int[][] board = {
                //0, 1, 2, 3, 4, 5, 6
                {0, 0, 0, 0, 0, 0, 0},   //0
                {0, 0, 0, 0, 0, 0, 0},   //1
                {0, 0, 0, 0, 0, 0, 0},   //2
                {0, 0, 1, 0, 0, 1, 0},   //3
                {0, 0, 1, 0, 0, 1, 0}, //4
                {0, 1, 1, 0, 1, 1, 0},   //5
                //0, 1, 2, 3, 4, 5, 6
        };

        int tempPlayer = 1;
        Board bitboard = new Bitboard(board, tempPlayer);
        System.out.println("bitboard: " + bitboard.heuristics());

        Board simpleBoard = new SimpleBoard(board, tempPlayer);
        System.out.println("simple board: " + simpleBoard.heuristics());
    }

    @Override
    public boolean canMakeMove(int col) {
        return (allPlayers & topMask(col)) == 0;
    }

    @Override
    public boolean isWinningMove(int col) {
        long copy = currentPlayer;
        copy |= (allPlayers + bottomMask(col)) & columnMask(col); //why column mask???

        return isWinningPosition(copy);
    }

    @Override
    public void makeMove(int col) {
        //switch player
        currentPlayer ^= allPlayers;

        //add new piece in column
        allPlayers |= allPlayers + bottomMask(col);

        moves++;
        player *= -1;
    }

    @Override
    public GameState getGameState() {
        if (isWinningPosition(currentPlayer)) {
            return (player == 1 ? GameState.PLAYER1 : GameState.PLAYER2);
        } else if (isWinningPosition(currentPlayer ^ allPlayers)) {
            return (player == 1 ? GameState.PLAYER2 : GameState.PLAYER1);
        }

        if (moves == rows * cols) {
            return GameState.DRAW;
        }

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
        return currentPlayer + allPlayers;
    }

    @Override
    public int heuristics() {
        long opponentPlayer = currentPlayer ^ allPlayers;

        //whenever negation is needed, all bits to the left of the 42nd bit
        //should always be 0, since they are not used in the board
        //also, the topmost row is a sentinel row, so it should also be 0
        long filterMask = 0b000000000000000_0111111_0111111_0111111_0111111_0111111_0111111_0111111L;

        int score = 0;
        int[] shifts = {
                rows + 1, //horizontal
                1, //vertical
                rows, //diagonal down
                rows + 2 //diagonal up
        };
        long[] positions = {
                currentPlayer,
                opponentPlayer
        };
        for (long pos : positions) {
            //scores for current player are always positive
            //and scores for opponent are always negative (no matter which players turn it is)
            int player = 1;
            if (pos == opponentPlayer) {
                player = -1;
            }

            for (int shift : shifts) {
                //detect patterns with 2 and 2 empties
                {
                    long t = pos & (pos >> shift); //detect 2 in a row
                    long temp = (~allPlayers & ((~allPlayers & filterMask) >> shift)) & filterMask; //detect 2 empties in a row
                    long left = temp & (t << 2 * shift); //check if left of 2 in row is 2 empties, ...0011...
                    long right = temp & (t >> 2 * shift); //check if right of 2 in row is 2 empties, ...1100...

                    long t1 = pos & (pos >> 3 * shift); //detect 2 on each end
                    long ends = t1 & (temp >> shift); //...1001...

                    temp = (~allPlayers & ((~allPlayers & filterMask) >> 3 * shift)) & filterMask; //detect 2 empties on each end
                    long middle = temp & (t >> shift); //...0110...

                    t = pos & (pos >> 2 * shift); //detect 2 with one space between
                    temp = (~allPlayers & ((~allPlayers & filterMask) >> 2 * shift)) & filterMask; //detect 2 empties with one space between
                    long left1 = temp & (t << shift); //...1010...
                    long right1 = temp & (t >> shift); //...0101...


                    int bits = Long.bitCount(left) + Long.bitCount(right) + Long.bitCount(ends) + Long.bitCount(middle) + Long.bitCount(left1) + Long.bitCount(right1);
                    if (bits > 0) {
                        score += bits * Scores.TWO_IN_ROW * player;
                    }
                }

                //detect pattern ...01110...
                {
                    //detect 3 in a row
                    long t = pos & (pos >> shift);
                    t = t & (t >> shift);

                    long left = (t >> shift) & ~allPlayers; //check if left of 3 in row is empty
                    left &= filterMask; //filter out invalid bits

                    long right = (t << 3 * shift) & ~allPlayers; //check right of 3 in row is empty
                    right &= filterMask; //filter out invalid bits

                    if (left > 0 || right > 0) {
                        score += (Long.bitCount(left) + Long.bitCount(right)) * Scores.THREE_IN_ROW * player;
                    }
                }

                //pattern ...1101... | ...1011
                {
                    //detect 2 in a row
                    long t = pos & (pos >> shift);

                    //pattern ...1011...
                    long left = pos & (t << 3 * shift); //check if left of 2 in a row is player
                    left = (left >> shift) & ~allPlayers; //check if between is empty
                    left &= filterMask; //filter out invalid bits

                    //pattern ...1101...
                    long right = pos & (t >> 2 * shift); //check if right of 2 in a row is player
                    right = (right << shift) & ~allPlayers; //check if between is empty
                    right &= filterMask; //filter out invalid bits

                    if (left > 0 || right > 0) {
                        score += (Long.bitCount(left) + Long.bitCount(right)) * Scores.THREE_IN_ROW * player;
                    }
                }
            }
        }

        return score;
    }

    private boolean isWinningPosition(long pos) {
        //the bit shifts to compute 4-in-row
        int[] shifts = {
                rows + 1, //horizontal
                1, //vertical
                rows, //diagonal down
                rows + 2 //diagonal up
        };

        long m;
        for (int shift : shifts) {
            m = pos & (pos >> shift); //makes sure to not count empty spaces between pieces
            if ((m & (m >> 2 * shift)) > 0) {
                return true;
            }
        }

        return false;
    }


    //a single 1 in the top cell of the given column
    private long topMask(int col) {
        return 1L << (rows - 1) << (rows + 1) * col;
    }

    //a single 1 in the bottom cell of the given column
    private long bottomMask(int col) {
        return 1L << (rows + 1) * col;
    }

    //a 1 in every cell of the given column
    private long columnMask(int col) {
        return ((1L << rows) - 1) << (rows + 1) * col;
    }


    public static int[][] boardFromBitboard(long bitboard) {
        String boardStr = String.format("%49s", Long.toBinaryString(bitboard))
                .replace(' ', '0');

        final int rows = 6;
        final int cols = 7;

        int[][] board = new int[rows + 1][cols];
        int i = 0, l = 0;
        for (int r = 0; r < boardStr.length(); r++) {
            if (r > 0 && r % (rows + 1) == 0 || r == boardStr.length() - 1) {
                if (r == boardStr.length() - 1) r++;

                String sub = boardStr.substring(l, r);
                for (int j = 0; j < Math.min(sub.length(), cols); j++) {
                    if (i >= 7) break;
                    board[i][j] = sub.charAt(j) - '0';
                }

                i++;
                l = r;
            }
        }

        //board has wrong orientation
        return rotateCW(board);
    }

    @Override
    public String toString() {
        String res = "";

        int[][] currentBoardArr = boardFromBitboard(currentPlayer);
        res += "Current Board:\n";
        for (int i = 0; i < currentBoardArr.length; i++) {
            for (int j = 0; j < currentBoardArr[0].length; j++) {
                res += currentBoardArr[i][j];
            }
            res += "\n";
        }
        res += "\n";

        int[][] maskBoardArr = boardFromBitboard(allPlayers);
        res += "Mask Board:\n";
        for (int i = 0; i < maskBoardArr.length; i++) {
            for (int j = 0; j < maskBoardArr[0].length; j++) {
                res += maskBoardArr[i][j];
            }
            res += "\n";
        }
        res += "\n";


        return res;
    }

    private void printLong(long a) {
        String str = String.format("%64s", Long.toBinaryString(a))
                .replace(' ', '0');
        System.out.println(str);
    }

    private void printArr(int[][] arr) {
        String res = "";
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[0].length; j++) {
                res += arr[i][j];
            }
            res += "\n";
        }
        res += "\n";
        System.out.println(res);
    }

    static int[][] rotateCW(int[][] mat) {
        final int M = mat.length;
        final int N = mat[0].length;
        int[][] ret = new int[N][M];
        for (int r = 0; r < M; r++) {
            for (int c = 0; c < N; c++) {
                ret[c][M - 1 - r] = mat[r][c];
            }
        }
        return ret;
    }
}
