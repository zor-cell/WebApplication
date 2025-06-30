import {Position} from "./Position";
import {Direction} from "./Direction";
import {Tile} from "./Tile";
import {BoardTile} from "./BoardTile";

export interface MoveGroup {
    position: Position,
    tiles: Tile[]
    directions: Direction[],
    boardTiles: BoardTile[]
}