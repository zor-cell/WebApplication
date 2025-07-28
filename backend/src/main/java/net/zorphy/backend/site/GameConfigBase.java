package net.zorphy.backend.site;

import net.zorphy.backend.main.dto.player.TeamDetails;

import java.util.List;

public interface GameConfigBase {
    List<TeamDetails> teams();
}
