import {GameStateBase} from "../../GameStateBase";
import {GameConfig} from "./GameConfig";
import {RoundInfo} from "../RoundInfo";

export interface GameState extends GameStateBase {
    gameConfig: GameConfig,
    rounds: RoundInfo[]
}