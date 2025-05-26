export interface Position {
    i: number,
    j: number
}

export interface PlayerConfig {
    value: number,
    isAi: boolean,
    maxTime: number,
    maxMemory: number,
    version: Version
}

export enum GameState {
    RUNNING,
    PLAYER1,
    PLAYER2,
    DRAW,
}

export enum Version {
    V1_0,
    V2_0,
    V2_1,
    PERFECT
}