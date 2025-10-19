import {PlayerDetails} from "../../all/PlayerDetails";
import {ChartData} from "./ChartData";
import {CorrelationResult} from "./CorrelationResult";
import {LinkedGameStats} from "./LinkedGameStats";

export interface GameStats {
    player: PlayerDetails;
    gamesPlayed: number;
    winRate: number;
    minScore: LinkedGameStats<number>;
    avgScore: number;
    maxScore: LinkedGameStats<number>;
    minDuration: LinkedGameStats<string>;
    avgDuration: string;
    maxDuration: LinkedGameStats<string>;
    nemesis: PlayerDetails | null;
    victim: PlayerDetails | null;
    rival: PlayerDetails | null;
    companion: PlayerDetails | null;
    correlations: CorrelationResult[];
    gameSpecific: any;
}