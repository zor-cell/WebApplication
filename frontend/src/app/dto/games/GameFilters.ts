export interface GameFilters {
    dateFrom: Date | null,
    dateTo: Date | null,
    minDuration: string | null,
    maxDuration: string | null,
    gameType: string | null
}