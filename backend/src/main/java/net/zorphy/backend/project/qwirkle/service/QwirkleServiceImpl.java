package net.zorphy.backend.project.qwirkle.service;

import net.zorphy.backend.project.connect4.exception.InvalidOperationException;
import net.zorphy.backend.project.qwirkle.dto.*;
import nu.pattern.OpenCV;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.CLAHE;
import org.opencv.imgproc.Imgproc;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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

        return new GameState(
                hand,
                stack,
                new HashMap<>()
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
    public void uploadImage(byte[] file) {

    }
}
