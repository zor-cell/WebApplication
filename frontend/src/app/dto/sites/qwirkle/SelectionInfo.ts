import {MoveGroup} from "./MoveGroup";
import {SelectionTile} from "./SelectionTile";

export interface SelectionInfo {
    tiles: SelectionTile[],
    moves: MoveGroup[]
}