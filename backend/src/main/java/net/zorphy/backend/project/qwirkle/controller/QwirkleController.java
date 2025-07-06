package net.zorphy.backend.project.qwirkle.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import net.zorphy.backend.main.exception.InvalidSessionException;
import net.zorphy.backend.project.qwirkle.dto.GameState;
import net.zorphy.backend.project.qwirkle.dto.SelectionInfo;
import net.zorphy.backend.project.qwirkle.dto.move.Move;
import net.zorphy.backend.project.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.project.qwirkle.dto.tile.Tile;
import net.zorphy.backend.project.qwirkle.service.QwirkleService;
import org.springframework.http.MediaType;
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
        this.qwirkleService = qwirkleService;
    }

    @PostMapping("clear")
    public void clearState(HttpSession session) {
        //check for valid session
        getGameState(session);
        session.removeAttribute(sessionKey);
    }

    @GetMapping("state")
    public GameState getState(HttpSession session) {
        return getGameState(session);
    }

    @PostMapping("start")
    public GameState createState(HttpSession session) {
        if (sessionExists(session)) {
            throw new InvalidSessionException("A game state for this session already exists");
        }

        GameState gameState = qwirkleService.initGameState();
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }



    @GetMapping("solve")
    public List<MoveGroup> getBestMoves(HttpSession session, @RequestParam(value = "maxMoves", defaultValue = "1") int maxMoves) {
        return qwirkleService.getBestMoves(getGameState(session), maxMoves);
    }

    @PostMapping("hand/clear")
    public GameState clearHand(HttpSession session) {
        GameState gameState = qwirkleService.clearHand(getGameState(session));
        session.setAttribute(sessionKey, gameState);

        return gameState;
    }

    @PostMapping("hand/selection")
    public SelectionInfo getSelectionInfo(HttpSession session, @Valid @RequestBody List<Tile> selected) {
        return qwirkleService.selectInHand(getGameState(session), selected);
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

    @PostMapping(value = "image/upload", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] uploadImage(HttpSession session, @RequestParam("file") MultipartFile file) throws IOException {
        return qwirkleService.uploadImage(file.getBytes());
    }

    @PostMapping("image/confirm")
    public void confirmImage(HttpSession session) {

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
