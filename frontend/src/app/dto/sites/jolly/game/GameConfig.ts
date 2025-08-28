import {GameConfigBase} from "../../GameConfigBase";
import {Team} from "../../../all/Team";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    roundLimit: number,
    noRoundLimit: boolean
}