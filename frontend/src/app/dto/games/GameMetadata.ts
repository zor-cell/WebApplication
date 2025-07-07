import {GameType} from "./GameType";
import {PlayerDetails} from "../all/PlayerDetails";

export interface GameMetadata {
    id: string,
    playedAt: Date,
    gameType: GameType,
    duration: string,
    players: PlayerDetails[]
}