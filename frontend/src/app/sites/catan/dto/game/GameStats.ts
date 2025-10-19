import {DiceRoll} from "../DiceRoll";

export interface GameStats {
    gameCount: number;
    luckMetric: number;
    diceRolls: DiceRoll[]
}