import {PlayerDetails} from "../../all/PlayerDetails";
import {ChartData} from "./ChartData";
import {GameSpecificStats} from "./GameSpecificStats";

export interface GameStats {
    player: PlayerDetails;
    gamesPlayed: number;
    winRate: number;
    avgScore: number;
    maxScore: number;
    nemesis: PlayerDetails | null; //worst win rate
    victim: PlayerDetails | null; //best win rate
    rival: PlayerDetails | null; //most played opponent
    companion: PlayerDetails | null; //most played teammate
    startPosCor: number;
    winsOverTime: ChartData<Date, boolean>;
    gameSpecific: GameSpecificStats;
}