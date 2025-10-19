import {Position} from "../../../../main/dto/all/Position";
import {Tile} from "./Tile";

export interface BoardTile {
    position: Position,
    tile: Tile
}