package net.zorphy.backend.project.qwirkle.controller;

import jakarta.servlet.http.HttpSession;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.project.catan.dto.GameState;
import net.zorphy.backend.project.qwirkle.service.QwirkleService;
import nu.pattern.OpenCV;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
    public void createState(HttpSession session) {

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
