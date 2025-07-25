import {StackTile} from "./StackTile";
import {BoardTile} from "./BoardTile";
import {Tile} from "./Tile";
import {PositionInfo} from "./PositionInfo";
import {GameConfig} from "./GameConfig";

export interface GameState {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    hand: Tile[],
    stack: StackTile[],
    board: BoardTile[],
    openPositions: PositionInfo[]
}