import {DiceRoll} from "../DiceRoll";
import {GameConfig} from "./GameConfig";
import {DicePair} from "../DicePair";
import {GameStateBase} from "../../GameStateBase";

export interface GameState extends GameStateBase {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    currentShipTurn: number,
    classicCards: DicePair[],
    eventCards: string[],
    diceRolls: DiceRoll[]
}