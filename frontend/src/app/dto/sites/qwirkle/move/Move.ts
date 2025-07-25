import {Position} from "../../../all/Position";
import {Direction} from "../enums/Direction";
import {Tile} from "../tile/Tile";

export interface Move {
    position: Position,
    direction: Direction,
    tiles: Tile[],
    score?: number
}