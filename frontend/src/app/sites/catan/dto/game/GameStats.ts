import {DiceRoll} from "../DiceRoll";
import {GameStatsMetrics} from "../../../../main/dto/games/stats/GameStatsMetrics";

export interface GameStats {
    gameCount: number;
    luckMetric: number;
    rollDurationMetrics: GameStatsMetrics<string>
    diceRolls: DiceRoll[]
}