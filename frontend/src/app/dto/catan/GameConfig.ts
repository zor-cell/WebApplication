import {DiceConfig} from "./DiceConfig";
import {Team} from "../global/Team";

export interface GameConfig {
    teams: Team[],
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}