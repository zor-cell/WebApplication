import {Hand} from "./Hand";
import {StackTile} from "./StackTile";
import {BoardTile} from "./BoardTile";

export interface GameState {
    hand: Hand,
    stack: StackTile[],
    board: BoardTile[]
}