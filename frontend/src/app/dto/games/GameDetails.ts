import {PlayerDetails} from "../all/PlayerDetails";
import {GameType} from "./GameType";
import {GameMetadata} from "./GameMetadata";

export interface GameDetails {
    metadata: GameMetadata,
    gameState: any,
    result: any,
}