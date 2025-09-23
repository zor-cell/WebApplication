package net.zorphy.backend.main.dto.game;

import net.zorphy.backend.main.dto.player.PlayerDetails;

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
        float startPosCor
) {
}
