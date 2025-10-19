import {Position} from "../../../../main/dto/all/Position";
import {Tile} from "../tile/Tile";
import {MoveGroupInfo} from "./MoveGroupInfo";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    groupInfos: MoveGroupInfo[]
}