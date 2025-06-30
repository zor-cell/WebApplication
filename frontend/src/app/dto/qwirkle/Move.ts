import {Position} from "./Position";
import {Direction} from "./Direction";
import {Tile} from "./Tile";

export interface Move {
    position: Position,
    direction: Direction,
    tiles: Tile[],
    score?: number
}