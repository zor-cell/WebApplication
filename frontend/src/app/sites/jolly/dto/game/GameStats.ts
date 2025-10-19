import {LinkedGameStats} from "../../../../main/dto/games/stats/LinkedGameStats";

export interface GameStats {
    roundsPlayed: number,
    roundWinRate: number,
    minRoundScore: LinkedGameStats<number>,
    avgRoundScore: number,
    maxRoundScore: LinkedGameStats<number>,
    minRoundDuration: LinkedGameStats<string>,
    avgRoundDuration: string,
    maxRoundDuration: LinkedGameStats<string>,
    outInOneRate: number,
    closedRate: number
}