import {GameType} from "./GameType";

export interface GameFilters {
    text: string | null;
    dateFrom: string | null,
    dateTo: string | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameTypes: GameType[] | null,
    players: string[] | null
}