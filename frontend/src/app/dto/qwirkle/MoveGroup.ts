import {Position} from "./Position";
import {Direction} from "./Direction";
import {Tile} from "./Tile";

export interface MoveGroup {
    position: Position,
    directions: Direction[],
    tiles: Tile[]
}