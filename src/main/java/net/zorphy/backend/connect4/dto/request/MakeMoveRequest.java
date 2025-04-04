package net.zorphy.backend.connect4.dto.request;

public record MakeMoveRequest(
        Integer[][] board,
        Integer player,
        Integer move
) {

}
