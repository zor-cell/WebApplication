import {DiceConfig} from "./DiceConfig";

export interface GameConfig {
    player: string[],
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}