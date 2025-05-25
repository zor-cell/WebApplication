export interface Position {
    i: number,
    j: number
}

export enum GameState {
    RUNNING,
    PLAYER1,
    PLAYER2,
    DRAW,
}