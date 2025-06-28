package net.zorphy.backend.project.qwirkle.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.project.qwirkle.dto.GameState;
import net.zorphy.backend.project.qwirkle.dto.Hand;
import net.zorphy.backend.project.qwirkle.dto.Tile;
import net.zorphy.backend.project.qwirkle.service.QwirkleService;
import nu.pattern.OpenCV;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/qwirkle")
public class QwirkleController {
    private static final String sessionKey = "qwirkle_gameState";
    private final QwirkleService qwirkleService;

    public QwirkleController(QwirkleService qwirkleService) {
        OpenCV.loadLocally();
        this.qwirkleService = qwirkleService;
    }

    @RequestMapping("state")
    public void getState(HttpSession session) {

    }

    @PostMapping("clear")
    public void clearState(HttpSession session) {

    }

    @PostMapping("start")
    public GameState createState(HttpSession session, @Valid @RequestBody Hand hand) {
        if(sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        GameState gameState = qwirkleService.initGameState(hand);
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("stack/draw")
    public GameState drawTile(HttpSession session, @Valid @RequestBody Tile tile) {
        GameState gameState = qwirkleService.drawTile(getGameState(session), tile);
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
        if(gameState == null) {
            throw new InvalidSessionException("No game state for this session exists");
        }

        return gameState;
    }
}
