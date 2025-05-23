package net.zorphy.backend.connect4.classes.table;

public class TranspositionTable {
    private final TableEntry[] entries;

    public TranspositionTable(int maxMB) {
        int byteSize = 32;
        int size = (maxMB * 1024 * 1024) / byteSize;

        entries = new TableEntry[size];
        System.out.println("Initiated table with " + entries.length + " entries!");
    }

    public TableEntry get(long key) {
        int index = (int) (key % entries.length);

        TableEntry entry = entries[index];
        if(entry != null && entry.key == key) {
            return entry;
        }

        return null;
    }

    public void put(TableEntry entry) {
        int index = (int) (entry.key % entries.length);
        entries[index] = entry;
    }
}
