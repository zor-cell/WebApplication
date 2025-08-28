package net.zorphy.backend.site.jolly.dto.game;

import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.site.all.base.GameConfigBase;

import java.util.List;

public record GameConfig(
        List<TeamDetails> teams,
        int roundLimit,
        boolean noRoundLimit
) implements GameConfigBase {
}
