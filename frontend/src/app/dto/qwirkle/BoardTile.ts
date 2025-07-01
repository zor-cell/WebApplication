import {Position} from "../global/Position";
import {Tile} from "./Tile";

export interface BoardTile {
    position: Position,
    tile: Tile
}