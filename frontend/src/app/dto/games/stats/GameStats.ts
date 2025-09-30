import {PlayerDetails} from "../../all/PlayerDetails";
import {ChartData} from "./ChartData";
import {CorrelationResult} from "./CorrelationResult";

export interface GameStats {
    player: PlayerDetails;
    gamesPlayed: number;
    winRate: number;
    avgScore: number;
    maxScore: number;
    nemesis: PlayerDetails | null;
    victim: PlayerDetails | null;
    rival: PlayerDetails | null;
    companion: PlayerDetails | null;
    startPosToScore: CorrelationResult;
    winsOverTime: ChartData<Date, boolean>;
    gameSpecific: any;
}