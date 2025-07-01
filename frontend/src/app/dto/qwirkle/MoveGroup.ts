import {Position} from "../global/Position";
import {Direction} from "./Direction";
import {Tile} from "./Tile";
import {BoardTile} from "./BoardTile";
import {groupInfo} from "./GroupInfo";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    groupInfos: groupInfo[]
}