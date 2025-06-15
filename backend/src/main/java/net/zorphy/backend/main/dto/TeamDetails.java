package net.zorphy.backend.main.dto;

import java.util.List;

public record TeamDetails(
        String name,
        List<PlayerDetails> players
) {
}
