import {DiceRoll} from "../DiceRoll";
import {GameConfig} from "./GameConfig";
import {DicePair} from "../DicePair";

export interface GameState {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    currentShipTurn: number,
    classicCards: DicePair[],
    eventCards: string[],
    diceRolls: DiceRoll[]
}