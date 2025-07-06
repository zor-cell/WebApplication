import {PlayerDetails} from "../all/PlayerDetails";
import {GameType} from "./GameType";

export interface GameDetails {
    id: string,
    playedAt: Date,
    gameType: GameType,
    duration: string,
    gameState: any,
    result: any,
    players: PlayerDetails[]
}