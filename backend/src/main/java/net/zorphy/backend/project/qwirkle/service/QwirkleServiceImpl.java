package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.connect4.exception.InvalidOperationException;
import net.zorphy.backend.project.qwirkle.dto.Direction;
import net.zorphy.backend.project.qwirkle.dto.*;
import net.zorphy.backend.project.qwirkle.service.util.Combinatorics;
import net.zorphy.backend.project.qwirkle.service.util.MultiColor;
import net.zorphy.backend.project.qwirkle.service.util.MultiShape;
import net.zorphy.backend.project.qwirkle.service.util.QwirkleUtil;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QwirkleServiceImpl implements QwirkleService{
    private static Map<Position, BoardTile> mapFromList(List<BoardTile> board) {
        return board.stream()
                .collect(Collectors.toMap(
                        BoardTile::position,
                        Function.identity()
                ));
    }

    private static List<BoardTile> listFromMap(Map<Position, BoardTile> board) {
        return board.values().stream()
                .toList();
    }

    @Override
    public GameState initGameState(List<Tile> hand) {
        //initialise stack
        List<StackTile> stack = new ArrayList<>();

        Color[] colors = Color.values();
        Shape[] shapes = Shape.values();

        for(int i = 0;i < 6;i++) {
            for(int j = 0;j < 6;j++) {
                //discard none types
                Color color = colors[i];
                Shape shape = shapes[j];
                Tile tile = new Tile(color, shape);

                stack.add(new StackTile(tile, 3));
            }
        }

        Map<Position, BoardTile> board = new HashMap<>();
        BoardTile[] temp = new BoardTile[] {
          new BoardTile(new Position(0, 0), new Tile(Color.PURPLE, Shape.SQUARE)),
          new BoardTile(new Position(1, 0), new Tile(Color.YELLOW, Shape.SQUARE)),
          new BoardTile(new Position(2, 0), new Tile(Color.ORANGE, Shape.SQUARE)),
          new BoardTile(new Position(3, 0), new Tile(Color.BLUE, Shape.SQUARE)),
          new BoardTile(new Position(0, -1), new Tile(Color.RED, Shape.SQUARE)),
          new BoardTile(new Position(-1, -1), new Tile(Color.RED, Shape.CIRCLE)),
          new BoardTile(new Position(1, 1), new Tile(Color.YELLOW, Shape.STAR4)),
          new BoardTile(new Position(2, 1), new Tile(Color.ORANGE, Shape.STAR4)),
          new BoardTile(new Position(3, 1), new Tile(Color.RED, Shape.STAR4)),
          new BoardTile(new Position(3, 2), new Tile(Color.RED, Shape.STAR8)),
        };
        for(var t : temp) {
            board.put(t.position(), t);
        }


        return new GameState(
                hand,
                stack,
                listFromMap(board)
        );
    }

    @Override
    public List<Move> getValidMoves(GameState gameState, List<Tile> tiles) {
        return QwirkleUtil.getLegalMoves(mapFromList(gameState.board()), tiles);
    }

    @Override
    public List<PositionInfo> getOpenPositions(GameState gameState) {
        List<Position> openPositions = QwirkleUtil.getOpenPositions(mapFromList(gameState.board()));

        return openPositions.stream()
                .map(p -> new PositionInfo(false, p))
                .toList();
    }

    @Override
    public List<Move> getBestMoves(GameState gameState, int maxMoves) {
        //find valid subsets of hand tiles
        List<List<Tile>> allSubsets = Combinatorics.getSubsets(gameState.hand());

        List<List<Tile>> validSubsets = new ArrayList<>();
        for(List<Tile> subset : allSubsets) {
            if(subset.isEmpty()) continue;

            MultiColor color = new MultiColor();
            MultiShape shape = new MultiShape();
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
            List<Move> tileMoves = QwirkleUtil.getLegalMoves(mapFromList(gameState.board()), tiles);
            moves.addAll(tileMoves);
        }

        moves.sort((a, b) -> {
            //descending for score
            int comp = Integer.compare(b.score(), a.score());
            if(comp == 0) {
                //descending according to tile size
                return Integer.compare(b.tiles().size(), a.tiles().size());
            }
            return comp;
        });


        return moves.subList(0, Math.min(maxMoves, moves.size()));
    }

    @Override
    public GameState drawTile(GameState oldState, Tile tile) {
        List<StackTile> stack = new ArrayList<>(oldState.stack());
        List<Tile> hand = new ArrayList<>(oldState.hand());

        //check if tile exists in stack
        Optional<StackTile> found = stack.stream()
                .filter(t -> t.tile().equals(tile))
                .findFirst();
        if(found.isEmpty() || found.get().count() <= 0) {
            throw new InvalidOperationException("Tile is not present in stack");
        }

        //check hand size
        if(hand.size() >= 6) {
            throw new InvalidOperationException("Hand is full");
        }

        //add to hand
        hand.add(tile);

        //update count of stack tile
        StackTile stackTile = found.get();
        StackTile updatedTile = new StackTile(stackTile.tile(), stackTile.count() - 1);

        int index = stack.indexOf(stackTile);
        stack.set(index, updatedTile);

        return new GameState(
                hand,
                stack,
                oldState.board()
        );
    }

    @Override
    public GameState makeMove(GameState oldState, Move move) {
        List<Tile> hand = new ArrayList<>(oldState.hand());
        Map<Position, BoardTile> board = mapFromList(oldState.board());

        //check if tiles are present in hand
        boolean allInHand = new HashSet<>(hand).containsAll(move.tiles());
        if(!allInHand) {
            throw new InvalidOperationException("Hand does not contain all given tiles");
        }

        //check if all moves are valid
        List<Position> tempPositions = new ArrayList<>();
        boolean valid = true;
        for(int tileIndex = 0;tileIndex < move.tiles().size();tileIndex++) {
            Position tilePos = move.position().stepsInDirection(move.direction(), tileIndex);
            Tile tile = move.tiles().get(tileIndex);
            BoardTile boardTile = new BoardTile(tilePos, tile);

            if(!QwirkleUtil.isValidMove(board, boardTile)) {
                valid = false;
                break;
            }

            board.put(tilePos, boardTile);
            tempPositions.add(tilePos);
        }
        if(!valid) {
            //remove placed tiles from board again if move is invalid
            for(Position tempPos : tempPositions) {
                board.remove(tempPos);
            }

            throw new InvalidOperationException("Move is invalid");
        }

        //remove tiles from hand
        for(Tile tile : move.tiles()) {
            hand.remove(tile);
        }

        return new GameState(
                hand,
                oldState.stack(),
                listFromMap(board)
        );
    }

    @Override
    public void uploadImage(byte[] file) {

    }
}
