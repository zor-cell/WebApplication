import {GameType} from "./GameType";

export interface GameFilters {
    dateFrom: string | null,
    dateTo: string | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameType: GameType | null
}