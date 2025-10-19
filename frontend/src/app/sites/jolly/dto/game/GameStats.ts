import {GameStatsMetrics} from "../../../../main/dto/games/stats/GameStatsMetrics";

export interface GameStats {
    roundsPlayed: number,
    roundWinRate: number,
    roundScoreMetrics: GameStatsMetrics<number>,
    roundDurationMetrics: GameStatsMetrics<string>,
    outInOneRate: number,
    closedRate: number
}