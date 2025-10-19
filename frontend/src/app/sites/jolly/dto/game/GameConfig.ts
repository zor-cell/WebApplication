import {GameConfigBase} from "../../../all/dto/GameConfigBase";
import {Team} from "../../../../main/dto/all/Team";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    roundLimit: number,
    noRoundLimit: boolean
}