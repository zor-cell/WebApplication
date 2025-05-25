export interface MoveRequest {
    board: number[][],
    player: number,
    move: number
}

export interface UndoRequest {
    board: number[][],
    move: number
}

export interface SolveRequest {
    board: number[][],
    player: number,
    maxTime: number,
    maxDepth: number,
    tableSize: number,
    version: number
}