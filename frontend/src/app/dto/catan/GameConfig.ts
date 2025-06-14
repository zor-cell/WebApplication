import {DiceConfig} from "./DiceConfig";
import {PlayerDetails} from "../global/PlayerDetails";
import {Team} from "../global/Team";

export interface GameConfig {
    teams: Team[],
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}