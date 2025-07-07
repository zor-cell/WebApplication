package net.zorphy.backend.site.connect4.dto.data;

public record Position(
        int i,
        int j
) {
    public boolean isInBounds(int rows, int cols) {
        return i >= 0 && i < rows && j >= 0 && j < cols;
    }
}

