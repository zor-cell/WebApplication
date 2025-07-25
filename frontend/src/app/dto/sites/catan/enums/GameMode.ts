export enum GameMode {
    ONE_VS_ONE = 'ONE_VS_ONE',
    CLASSIC = 'CLASSIC',
    CITIES_AND_KNIGHTS = 'CITIES_AND_KNIGHTS'
}

export function getGameModeName(mode: GameMode) {
    switch (mode) {
        case GameMode.ONE_VS_ONE:
            return '1 vs 1';
        case GameMode.CLASSIC:
            return 'Classic';
        case GameMode.CITIES_AND_KNIGHTS:
            return 'Cities & Knights';
        default:
            return 'Unknown';
    }
}