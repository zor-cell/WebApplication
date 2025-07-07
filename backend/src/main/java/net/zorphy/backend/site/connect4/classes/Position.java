package net.zorphy.backend.site.connect4.classes;

public class Position {
    public int i;
    public int j;

    public Position(int i, int j) {
        this.i = i;
        this.j = j;
    }

    public boolean isInBounds(int rows, int cols) {
        return i >= 0 && i < rows && j >= 0 && j < cols;
    }

    @Override
    public String toString() {
        return "Position{" +
                "y=" + i +
                ", x=" + j +
                '}';
    }
}
