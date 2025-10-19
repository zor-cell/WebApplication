import {DiceRoll} from "../DiceRoll";
import {LinkedGameStats} from "../../../../main/dto/games/stats/LinkedGameStats";

export interface GameStats {
    gameCount: number;
    luckMetric: number;
    minRollDuration: LinkedGameStats<string>,
    maxRollDuration: LinkedGameStats<string>,
    avgRollDuration: string,
    diceRolls: DiceRoll[]
}