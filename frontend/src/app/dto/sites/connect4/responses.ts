import {GameState} from "./data";

export interface MoveResponse {
    board: number[][],
    gameState: GameState
}

export interface SolveResponse {
    board: number[][],
    move: number,
    gameState: GameState,
    score: number,
    winDistance: number
}