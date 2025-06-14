package net.zorphy.backend.main.dto;

public record TeamDetails(
        String name,
        PlayerDetails[] players
) {
}
