import {Position} from "../../all/Position";
import {Tile} from "./Tile";
import {MoveGroupInfo} from "./MoveGroupInfo";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    groupInfos: MoveGroupInfo[]
}