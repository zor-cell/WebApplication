import {MoveGroup} from "./move/MoveGroup";
import {SelectionTile} from "./tile/SelectionTile";

export interface SelectionInfo {
    tiles: SelectionTile[],
    moves: MoveGroup[]
}