package net.zorphy.backend.site.all.dto;

import net.zorphy.backend.main.dto.player.TeamDetails;

import java.util.List;

public interface GameConfigBase {
    List<TeamDetails> teams();
}
