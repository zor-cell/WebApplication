package net.zorphy.backend.project.qwirkle.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public record GameState(
        Hand hand,

        List<StackTile> stack,

        Map<Position, BoardTile> board
) {
}
