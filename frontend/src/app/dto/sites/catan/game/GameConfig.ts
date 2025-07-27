import {DiceConfig} from "../DiceConfig";
import {Team} from "../../../all/Team";
import {GameMode} from "../enums/GameMode";
import {GameConfigBase} from "../../GameConfigBase";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    gameMode: GameMode,
    classicDice: DiceConfig,
    eventDice: DiceConfig,
    maxShipTurns: number
}