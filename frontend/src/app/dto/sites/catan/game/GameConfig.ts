import {DiceConfig} from "../DiceConfig";
import {Team} from "../../../all/Team";
import {GameMode} from "../enums/GameMode";

export interface GameConfig {
    teams: Team[],
    gameMode: GameMode,
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}