import {DiceConfig} from "./DiceConfig";
import {PlayerDetails} from "../global/PlayerDetails";

export interface GameConfig {
    players: PlayerDetails[],
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}