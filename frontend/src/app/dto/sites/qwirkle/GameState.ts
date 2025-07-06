import {StackTile} from "./StackTile";
import {BoardTile} from "./BoardTile";
import {Tile} from "./Tile";
import {PositionInfo} from "./PositionInfo";

export interface GameState {
    hand: Tile[],
    stack: StackTile[],
    board: BoardTile[],
    openPositions: PositionInfo[]
}