package net.zorphy.backend.dto.connect4.data;

public record Position(
         int i,
         int j
) {
    public boolean isInBounds(int rows, int cols) {
        return i >= 0 && i < rows && j >= 0 && j < cols;
    }
}

