import {Position} from "../../all/Position";
import {Tile} from "./Tile";
import {groupInfo} from "./GroupInfo";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    groupInfos: groupInfo[]
}