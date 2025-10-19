import {Team} from "../../../../main/dto/all/Team";
import {GameConfigBase} from "../../../all/dto/GameConfigBase";

export interface GameConfig extends GameConfigBase {
    teams: Team[],
    playingTeam: number
}