import {Direction} from "./Direction";
import {BoardTile} from "./BoardTile";

export interface MoveGroupInfo {
    direction: Direction,
    score: number,
    boardTiles: BoardTile[]
}