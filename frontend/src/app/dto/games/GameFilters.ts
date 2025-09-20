import {GameType} from "./GameType";
import {PlayerDetails} from "../all/PlayerDetails";

export interface GameFilters {
    text: string | null;
    dateFrom: string | null,
    dateTo: string | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameTypes: GameType[] | null,
    players: string[] | null
}