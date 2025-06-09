import {DiceConfig} from "./DiceConfig";

export interface GameConfig {
    players: string[],
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}