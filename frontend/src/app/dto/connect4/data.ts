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

export enum Version {
    V1_0,
    V1_1,
    V2_0,
    V2_1,
    PERFECT
}