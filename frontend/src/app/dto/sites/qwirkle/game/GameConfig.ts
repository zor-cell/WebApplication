import {Team} from "../../../all/Team";
import {GameConfigBase} from "../../GameConfigBase";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    playingTeam: number
}