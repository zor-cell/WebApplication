import {PlayerDetails} from "./PlayerDetails";
import {GameType} from "./GameType";

export interface GameDetails {
    playedAt: Date,
    gameType: GameType,
    gameState: any,
    winners: PlayerDetails[],
    players: PlayerDetails[]
}