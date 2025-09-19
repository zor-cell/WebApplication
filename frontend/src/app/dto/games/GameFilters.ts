import {GameType} from "./GameType";

export interface GameFilters {
    text: string | null;
    dateFrom: string | null,
    dateTo: string | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameType: GameType | null
}