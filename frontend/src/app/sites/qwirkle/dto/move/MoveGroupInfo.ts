import {Direction} from "../enums/Direction";
import {BoardTile} from "../tile/BoardTile";

export interface MoveGroupInfo {
    direction: Direction,
    score: number,
    boardTiles: BoardTile[]
}