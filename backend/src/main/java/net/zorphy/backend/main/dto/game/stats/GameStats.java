package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.util.List;

public record GameStats(
        PlayerDetails player,
        int gamesPlayed,
        float winRate,
        float avgScore,
        int maxScore,
        PlayerDetails nemesis,
        PlayerDetails victim,
        PlayerDetails rival,
        PlayerDetails companion,
        List<GameStatsCorrelation<Integer>> startPosCorrelation,
        GameSpecificStats gameSpecific
) {
}
