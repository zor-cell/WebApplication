import {StackTile} from "../tile/StackTile";
import {BoardTile} from "../tile/BoardTile";
import {Tile} from "../tile/Tile";
import {PositionInfo} from "../PositionInfo";
import {GameConfig} from "./GameConfig";
import {GameStateBase} from "../../GameStateBase";

export interface GameState extends GameStateBase {
    gameConfig: GameConfig,
    currentPlayerTurn: number,
    hand: Tile[],
    stack: StackTile[],
    board: BoardTile[],
    openPositions: PositionInfo[]
}