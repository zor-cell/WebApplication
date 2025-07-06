import {DiceConfig} from "./DiceConfig";
import {Team} from "../../all/Team";
import {GameMode} from "./GameMode";

export interface GameConfig {
    teams: Team[],
    gameMode: GameMode,
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}