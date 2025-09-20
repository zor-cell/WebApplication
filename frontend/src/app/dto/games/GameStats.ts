import {PlayerDetails} from "../all/PlayerDetails";

export interface GameStats {
    winRate: number;
    avgScore: number;
    maxScore: number;
    nemesis: PlayerDetails | null; //worst win rate
    victim: PlayerDetails | null; //best win rate
    rival: PlayerDetails | null; //most played opponent
    companion: PlayerDetails | null; //most played teammate
    startPosCor: number;
}