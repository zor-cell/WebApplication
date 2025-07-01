package net.zorphy.backend.project.qwirkle.service.util;

import net.zorphy.backend.project.qwirkle.dto.*;

import java.util.*;

public class QwirkleUtil {
    /**
     * Computes all legal moves for given the given {@code tiles} and {@code board}.
     * Legal moves are moves, where the tiles can be placed in the given order and still result
     * in a valid board state.
     */
    public static List<Move> getLegalMoves(Map<Position, BoardTile> board, List<Tile> tiles) {
        List<Move> moves = new ArrayList<>();

        if (tiles.isEmpty()) {
            return moves;
        }

        List<Position> legalPositions = getLegalPositions(board, tiles.getFirst());
        //only one tile in set is trivial
        if (tiles.size() == 1) {
            return legalPositions.stream()
                    .map(pos -> {
                        int score = scoreInDirections(board, pos, Direction.getPairs());
                        ;
                        return new Move(pos, Direction.UP, tiles, score);
                    })
                    .toList();
        }

        //try every valid position for first tile
        for (Position pos : legalPositions) {
            for (Direction dir : Direction.values()) {
                //go through all tiles and try placing in the current direction
                List<Position> tempPositions = new ArrayList<>();
                boolean valid = true;
                int score = 0;
                for (int tileIndex = 0; tileIndex < tiles.size(); tileIndex++) {
                    Position tilePos = pos.stepsInDirection(dir, tileIndex);

                    BoardTile boardTile = new BoardTile(tilePos, tiles.get(tileIndex));
                    if (!isValidMove(board, boardTile)) {
                        valid = false;
                        break;
                    }

                    //check directions in right angle to placement direction for scoring
                    Direction[] scoreDirections = new Direction[]{dir.rotate90Deg(), dir.rotate90Deg().inverse()};
                    score += scoreInDirections(board, tilePos, new Direction[][]{scoreDirections});

                    //add tiles to grid temporarily to get valid positions
                    board.put(tilePos, boardTile);
                    tempPositions.add(tilePos);
                }

                //compute score in placement direction for last tile
                if (valid) {
                    Position lastPos = pos.stepsInDirection(dir, tiles.size() - 1);
                    Direction[] scoreDirections = new Direction[]{dir, dir.inverse()};
                    score += scoreInDirections(board, lastPos, new Direction[][]{scoreDirections});
                }


                //delete temp tiles from grid
                for (Position tempPos : tempPositions) {
                    board.remove(tempPos);
                }

                //compute score for move if all tiles in this direction are valid
                if (valid) {
                    Move move = new Move(pos, dir, tiles, score);
                    moves.add(move);
                }
            }
        }

        return moves;
    }

    /**
     * Indicates whether a given {@code boardTile} is valid on a given {@code board}.
     */
    public static boolean isValidMove(Map<Position, BoardTile> board, BoardTile boardTile) {
        if (board.isEmpty()) {
            //position not (0,0)
            return boardTile.position().equals(new Position(0, 0));
        } else if (board.containsKey(boardTile.position())) {
            //position occupied
            return false;
        }

        //check if at least one neighbor exists
        boolean foundNeighbor = false;
        for (Direction d : Direction.values()) {
            Position next = boardTile.position().stepsInDirection(d, 1);
            if (board.containsKey(next)) {
                foundNeighbor = true;
                break;
            }
        }
        if (!foundNeighbor) return false;

        return isValidInDirections(board, boardTile);
    }

    public static List<Position> getOpenPositions(Map<Position, BoardTile> board) {
        Set<Position> freePositions = new HashSet<>();

        //get all neighboring positions
        for (Position pos : board.keySet()) {
            for (Direction dir : Direction.values()) {
                Position neighbor = pos.stepsInDirection(dir, 1);
                if (!board.containsKey(neighbor)) {
                    freePositions.add(neighbor);
                }
            }
        }

        return freePositions.stream().toList();
    }

    public static boolean isDeadPosition(Map<Position, BoardTile> board, Position position) {
        Direction[][] directionPairs = Direction.getPairs();

        //TODO: does not work perfectly
        // rs x rs is not a dead position
        List<MultiColor> allColors = new ArrayList<>();
        List<MultiShape> allShapes = new ArrayList<>();
        for (Direction[] pair : directionPairs) {
            MultiColor color = new MultiColor();
            MultiShape shape = new MultiShape();

            for (Direction dir : pair) {
                int steps = 1;
                Position next = position.stepsInDirection(dir, steps);
                //if no neighbor exists keep going in other directions
                if (!board.containsKey(next)) {
                    continue;
                }

                //accumulate colors of neighbors
                while (board.containsKey(next)) {
                    BoardTile neighbor = board.get(next);

                    //TODO: should we check if flag exists?
                    color.addFlag(neighbor.tile().color());
                    shape.addFlag(neighbor.tile().shape());

                    steps++;
                    next = position.stepsInDirection(dir, steps);
                }
            }

            boolean colorGood = color.isSingle() || color.getValue() == 0;
            boolean shapeGood = shape.isSingle() || shape.getValue() == 0;
            if (!(colorGood || shapeGood)) {
                return true;
            }

            allColors.add(color);
            allShapes.add(shape);
        }

        //the direction pairs have to be compatible with each other
        MultiColor accCol = allColors.getFirst();
        MultiShape accShape = allShapes.getFirst();
        for (int i = 1; i < allColors.size(); i++) {
            MultiColor color = allColors.get(i);
            MultiShape shape = allShapes.get(i);

            if (!(accCol.isCompatible(color) && accShape.isCompatible(shape))) {
                return true;
            }
        }

        return false;
    }


    private static List<Position> getLegalPositions(Map<Position, BoardTile> board, Tile tile) {
        List<Position> openPositions = getOpenPositions(board);

        //check valid of all free positions
        List<Position> validPositions = new ArrayList<>();
        for (Position pos : openPositions) {
            BoardTile boardTile = new BoardTile(pos, tile);
            if (isValidInDirections(board, boardTile)) {
                validPositions.add(pos);
            }
        }

        return validPositions;
    }

    private static int scoreInDirections(Map<Position, BoardTile> board, Position position, Direction[][] directions) {
        int count = 0;
        for (Direction[] pair : directions) {
            int curCount = 0;
            int steps = 1;
            for (Direction scoreDir : pair) {
                Position next = position.stepsInDirection(scoreDir, steps);
                while (board.containsKey(next)) {
                    curCount++;

                    steps++;
                    next = position.stepsInDirection(scoreDir, steps);
                }
            }

            //include placed piece if something was found
            if (curCount > 0) {
                curCount++;
            }

            //qwirkle reached
            if (curCount == 6) {
                curCount = 12;
            }

            count += curCount;
        }

        return count;
    }

    private static boolean isValidInDirections(Map<Position, BoardTile> board, BoardTile boardTile) {
        //check compatibility
        Direction[][] directionPairs = Direction.getPairs();
        for (Direction[] pair : directionPairs) {
            MultiColor color = new MultiColor();
            MultiShape shape = new MultiShape();

            for (Direction dir : pair) {
                int steps = 1;
                Position next = boardTile.position().stepsInDirection(dir, steps);
                //if no neighbor exists keep going in other directions
                if (!board.containsKey(next)) {
                    continue;
                }

                //accumulate colors of neighbors
                while (board.containsKey(next)) {
                    BoardTile neighbor = board.get(next);

                    //if the same piece already exists, position is invalid
                    if (color.hasColor(neighbor.tile().color()) && shape.hasShape(neighbor.tile().shape())) {
                        return false;
                    }

                    color.addFlag(neighbor.tile().color());
                    shape.addFlag(neighbor.tile().shape());

                    steps++;
                    next = boardTile.position().stepsInDirection(dir, steps);
                }

                //check compatibility for every direction for efficiency
                //the last pass checks for compatibility with all previous directions in pair
                if (!boardTile.tile().isCompatible(color, shape)) {
                    return false;
                }
            }
        }

        return true;
    }
}
