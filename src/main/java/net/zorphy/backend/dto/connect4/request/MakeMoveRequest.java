package net.zorphy.backend.dto.connect4.request;

import net.zorphy.backend.dto.connect4.data.Position;

public record MakeMoveRequest(
        Integer[][] board,
        Integer player,
        Position position
) {

}
