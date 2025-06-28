package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.connect4.exception.InvalidOperationException;
import net.zorphy.backend.project.qwirkle.dto.Direction;
import net.zorphy.backend.project.qwirkle.dto.*;
import net.zorphy.backend.project.qwirkle.service.util.Combinatorics;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QwirkleServiceImpl implements QwirkleService{
    @Override
    public GameState initGameState(Hand hand) {
        //initialise stack
        List<StackTile> stack = new ArrayList<>();

        Color[] colors = Color.values();
        Shape[] shapes = Shape.values();

        for(int i = 0;i < 6;i++) {
            for(int j = 0;j < 6;j++) {
                //discard none types
                Color color = colors[i + 1];
                Shape shape = shapes[j + 1];
                Tile tile = new Tile(color, shape);

                stack.add(new StackTile(tile, 3));
            }
        }

        //TODO: map board on correct coordinates
        Map<Position, BoardTile> board = new HashMap<>();
        BoardTile[] temp = new BoardTile[] {
          new BoardTile(new Position(0, 0), new Tile(Color.PURPLE, Shape.SQUARE)),
          new BoardTile(new Position(1, 0), new Tile(Color.YELLOW, Shape.SQUARE)),
          new BoardTile(new Position(2, 0), new Tile(Color.ORANGE, Shape.SQUARE)),
          new BoardTile(new Position(3, 0), new Tile(Color.BLUE, Shape.SQUARE)),
          new BoardTile(new Position(0, -1), new Tile(Color.RED, Shape.SQUARE)),
          new BoardTile(new Position(-1, -1), new Tile(Color.RED, Shape.CIRCLE)),
          new BoardTile(new Position(1, 1), new Tile(Color.YELLOW, Shape.STAR4)),
          new BoardTile(new Position(2, 1), new Tile(Color.RED, Shape.STAR4)),
          new BoardTile(new Position(3, 1), new Tile(Color.RED, Shape.STAR4)),
          new BoardTile(new Position(3, 2), new Tile(Color.RED, Shape.STAR8)),
        };
        for(var t : temp) {
            board.put(t.position(), t);
        }


        return new GameState(
                hand,
                stack,
                board
        );
    }

    @Override
    public GameState drawTile(GameState oldState, Tile tile) {
        List<StackTile> stack = new ArrayList<>(oldState.stack());
        Hand hand = new Hand(oldState.hand().tiles());

        //remove the tile from the stack
        Optional<StackTile> found = stack.stream()
                .filter(t -> t.tile().equals(tile))
                .findFirst();
        if(found.isEmpty() || found.get().count() <= 0) {
            throw new InvalidOperationException("Tile is not present in stack");
        }

        StackTile stackTile = found.get();
        StackTile updatedTile = new StackTile(stackTile.tile(), stackTile.count() - 1);

        int index = stack.indexOf(stackTile);
        stack.set(index, updatedTile);

        //update hand
        if(hand.tiles().size() >= 6) {
            throw new InvalidOperationException("Hand is full");
        }
        hand.tiles().add(tile);

        return new GameState(
                hand,
                stack,
                oldState.board()
        );
    }

    @Override
    public Move makeBestMove(GameState gameState) {
        //find valid subsets of hand tiles
        List<List<Tile>> allSubsets = Combinatorics.getSubsets(gameState.hand().tiles());

        List<List<Tile>> validSubsets = new ArrayList<>();
        for(List<Tile> subset : allSubsets) {
            if(subset.isEmpty()) continue;

            Color color = Color.NONE;
            Shape shape = Shape.NONE;
            for(Tile tile : subset) {
                color.addFlag(tile.color());
                shape.addFlag(tile.shape());
            }

            if(color.isSingle() || shape.isSingle()) {
                //if color and shape are both only one value, subset must be of size 1
                if(color.isSingle() && shape.isSingle() && subset.size() > 1) {
                    continue;
                }

                //add all permutations of a subset
                List<List<Tile>> permutations = Combinatorics.getPermutations(subset);
                validSubsets.addAll(permutations);
            }
        }

        //find best move in all valid permutation subsets
        List<Move> moves = new ArrayList<>();
        for(List<Tile> tiles : validSubsets) {
            List<Move> tileMoves = getLegalMoves(gameState.board(), tiles);
            moves.addAll(tileMoves);
        }

        Optional<Move> bestMove = moves.stream()
                .max(Comparator.comparingInt(Move::score));

        return bestMove.orElse(null);
    }

    private int scoreInDirections(Map<Position, BoardTile> board, Position position, Direction[] directions) {
        int count = 1; //include piece at pos as well
        int steps = 1;
        for(Direction scoreDir : directions) {
            while (board.containsKey(position.stepsInDirection(scoreDir, steps))) {
                count++;
                steps++;
            }
        }

        //qwirkle reached
        if(count == 6) {
            count = 12;
        }

        return count;
    }

    private List<Move> getLegalMoves(Map<Position, BoardTile> board, List<Tile> tiles) {
        List<Move> moves = new ArrayList<>();

        if(tiles.isEmpty()) {
            return moves;
        }

        List<Position> legalPositions = getLegalPositions(board, tiles.getFirst());
        //only one tile in set is trivial
        if(tiles.size() == 1) {
            return legalPositions.stream()
                    .map(pos -> {
                        int score = scoreInDirections(board, pos, Direction.values());;
                        return new Move(pos, Direction.UP, tiles, score);
                    })
                    .toList();
        }

        //try every valid position for first tile
        for(Position pos : legalPositions) {
            for(Direction dir : Direction.values()) {
                //go through all tiles and try placing in the current direction
                List<Position> tempPositions = new ArrayList<>();
                boolean valid = true;
                int score = 0;
                for(int tileIndex = 0;tileIndex < tiles.size();tileIndex++) {
                    Position tilePos = pos.stepsInDirection(dir, tileIndex);

                    BoardTile boardTile = new BoardTile(tilePos, tiles.get(tileIndex));
                    if(!isValidMove(board, boardTile)) {
                        valid = false;
                        break;
                    }

                    //check directions in right angle to placement direction for scoring
                    Direction[] scoreDirections = new Direction[]{dir.rotate90Deg(), dir.rotate90Deg().inverse()};
                    score += scoreInDirections(board, pos, scoreDirections);

                    //add tiles to grid temporarily to get valid positions
                    board.put(tilePos, boardTile);
                    tempPositions.add(tilePos);
                }

                //compute score in all directions for last tile
                if(valid) {
                    score += scoreInDirections(board, pos, Direction.values());
                }


                //delete temp tiles from grid
                for(Position tempPos : tempPositions) {
                    board.remove(tempPos);
                }

                //compute score for move if all tiles in this direction are valid
                if(valid) {
                    Move move = new Move(pos, dir, tiles, score);
                    moves.add(move);
                }
            }
        }

        return moves;
    }

    private List<Position> getLegalPositions(Map<Position, BoardTile> board, Tile tile) {
        Set<Position> freePositions = new HashSet<>();

        //get all neighboring positions
        for(Position pos : board.keySet()) {
            for(Direction dir : Direction.values()) {
                Position neighbor = pos.stepsInDirection(dir, 1);
                if(!board.containsKey(neighbor)) {
                    freePositions.add(neighbor);
                }
            }
        }

        //check valids of all free positions
        List<Position> validPositions = new ArrayList<>();
        for(Position pos : freePositions) {
            BoardTile boardTile = new BoardTile(pos, tile);
            if(isValidInDirections(board, boardTile)) {
                validPositions.add(pos);
            }
        }

        return validPositions;
    }



    @Override
    public GameState makeMove(GameState oldState, BoardTile boardTile) {
        Hand hand = new Hand(oldState.hand().tiles());
        Map<Position, BoardTile> board = new HashMap<>(oldState.board());

        //remove tile from hand
        Optional<Tile> found = hand.tiles().stream()
                .filter(t -> t.equals(boardTile.tile()))
                .findFirst();
        if(found.isEmpty()) {
            throw new InvalidOperationException("Hand does not contain given tile");
        }
        hand.tiles().remove(found.get());

        //add tile to board
        if(!isValidMove(oldState.board(), boardTile)) {
            throw new InvalidOperationException("Move is invalid");
        }
        board.put(boardTile.position(), boardTile);


        return new GameState(
                hand,
                oldState.stack(),
                board
        );
    }

    @Override
    public void uploadImage(byte[] file) {

    }

    private boolean isValidMove(Map<Position, BoardTile> board, BoardTile boardTile) {
        if(board.isEmpty()) {
            //position not (0,0)
            return boardTile.position().equals(new Position(0, 0));
        } else if(board.containsKey(boardTile.position())) {
            //position occupied
            return false;
        }

        //check if at least one neighbor exists
        boolean foundNeighbor = false;
        for(Direction d : Direction.values()) {
            Position next = boardTile.position().stepsInDirection(d, 1);
            if(board.containsKey(next)) {
                foundNeighbor = true;
                break;
            }
        }
        if(!foundNeighbor) return false;

        return isValidInDirections(board, boardTile);
    }

    private boolean isValidInDirections(Map<Position, BoardTile> board, BoardTile boardTile) {
        //check compatibility
        Direction[][] directionPairs = Direction.getPairs();
        for(Direction[] pair : directionPairs) {
            Color color = Color.NONE;
            Shape shape = Shape.NONE;

            for(Direction dir : pair) {
                int steps = 1;
                Position next = boardTile.position().stepsInDirection(dir, steps);
                while(board.containsKey(next)) {
                    BoardTile neighbor = board.get(next);

                    color.addFlag(neighbor.tile().color());
                    shape.addFlag(neighbor.tile().shape());

                    steps++;
                    next = boardTile.position().stepsInDirection(dir, steps);
                }

                if(!boardTile.tile().isCompatible(color, shape)) {
                    return false;
                }
            }
        }

        return true;
    }
}
