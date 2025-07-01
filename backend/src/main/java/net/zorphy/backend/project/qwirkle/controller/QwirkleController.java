package net.zorphy.backend.project.qwirkle.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.project.qwirkle.dto.*;
import net.zorphy.backend.project.qwirkle.service.QwirkleService;
import nu.pattern.OpenCV;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/qwirkle")
public class QwirkleController {
    private static final String sessionKey = "qwirkle_gameState";
    private final QwirkleService qwirkleService;

    public QwirkleController(QwirkleService qwirkleService) {
        OpenCV.loadLocally();
        this.qwirkleService = qwirkleService;
    }

    @GetMapping("state")
    public GameState getState(HttpSession session) {
        return getGameState(session);
    }

    @GetMapping("solve")
    public List<Move> getBestMoves(HttpSession session, @RequestParam(value = "maxMoves", defaultValue = "1") int maxMoves) {
        return qwirkleService.getBestMoves(getGameState(session), maxMoves);
    }

    @PostMapping("clear")
    public void clearState(HttpSession session) {
        //check for valid session
        getGameState(session);

        session.removeAttribute(sessionKey);
    }

    @PostMapping("start")
    public GameState createState(HttpSession session, @Valid @RequestBody List<Tile> hand) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        GameState gameState = qwirkleService.initGameState(hand);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("moves")
    public List<MoveGroup> getValidMoves(HttpSession session, @RequestBody List<Tile> tiles) {
        return qwirkleService.getValidMoves(getGameState(session), tiles);
    }

    @PostMapping("stack/draw")
    public GameState drawTile(HttpSession session, @Valid @RequestBody Tile tile) {
        GameState gameState = qwirkleService.drawTile(getGameState(session), tile);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("move")
    public GameState makeMove(HttpSession session, @RequestBody Move move) {
        GameState gameState = qwirkleService.makeMove(getGameState(session), move);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("image")
    public void uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        Mat mat = Mat.eye(3, 3, CvType.CV_8UC1);
        qwirkleService.uploadImage(file.getBytes());
    }


    private boolean sessionExists(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(sessionKey);
        return gameState != null;
    }

    private GameState getGameState(HttpSession session) {
        GameState gameState = (GameState) session.getAttribute(sessionKey);
        if (gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }
}
