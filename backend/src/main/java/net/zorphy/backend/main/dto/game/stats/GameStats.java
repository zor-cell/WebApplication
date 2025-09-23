package net.zorphy.backend.main.dto.game.stats;

import net.zorphy.backend.main.dto.player.PlayerDetails;

import java.time.Instant;

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
        float startPosCor,
        ChartData<Instant, Boolean> winsOverTime,
        GameSpecificStats gameSpecific
) {
}
