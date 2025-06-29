import {StackTile} from "./StackTile";
import {BoardTile} from "./BoardTile";
import {Tile} from "./Tile";

export interface GameState {
    hand: Tile[],
    stack: StackTile[],
    board: BoardTile[]
}