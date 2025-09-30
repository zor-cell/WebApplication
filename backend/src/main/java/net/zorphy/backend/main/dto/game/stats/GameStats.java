package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.player.PlayerDetails;


public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        double winRate,
        double avgScore,
        int maxScore,
        PlayerDetails nemesis,
        PlayerDetails victim,
        PlayerDetails rival,
        PlayerDetails companion,
        CorrelationResult startPosToScore,
        GameSpecificStats gameSpecific
) {
}
