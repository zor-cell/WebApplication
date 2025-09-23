import {ChartData} from "../../../games/stats/ChartData";
import {GameSpecificStats} from "../../../games/stats/GameSpecificStats";

export interface GameStats extends GameSpecificStats {
    diceRolls: ChartData<number, number>
}