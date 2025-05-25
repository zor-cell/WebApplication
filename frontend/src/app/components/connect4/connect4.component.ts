import {Component} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NgForOf} from "@angular/common";
import {Connect4Service} from "../../services/connect4.service";
import {MoveRequest, SolveRequest, UndoRequest} from "../../dto/connect4/requests";
import {GameState} from "../../dto/connect4/data";
import {Globals} from "../../classes/globals";
import {PlayerSettingsComponent} from "./player-settings/player-settings.component";

@Component({
    selector: 'app-connect4',
    imports: [
        CellComponent,
        NgForOf,
        PlayerSettingsComponent
    ],
    templateUrl: './connect4.component.html',
    standalone: true,
    styleUrl: './connect4.component.css'
})
export class Connect4Component {
    board!: number[][];
    gameOver!: boolean;
    currentPlayer!: number;
    gameState!: GameState;
    moves!: number[];
    isLoading!: boolean

    constructor(private globals: Globals, private connect4Service: Connect4Service) {
        this.refresh();
    }

    togglePlayer(): void {
        this.currentPlayer = this.currentPlayer === 1 ? -1 : 1;
    }

    refresh(): void {
        this.board = this.createBoard(6, 7);
        this.gameOver = false;
        this.currentPlayer = 1;
        this.gameState = GameState.RUNNING;
        this.moves = new Array(0);
        this.isLoading = false;
    }

    makeMove(col: number) {
        if (this.gameOver) return;

        let moveRequest: MoveRequest = {
            board: this.board,
            player: this.currentPlayer,
            move: col
        };

        this.isLoading = true;
        this.connect4Service.move(moveRequest).subscribe({
            next: res => {
                this.board = res.board;
                this.gameState = res.gameState;

                this.moves.push(moveRequest.move);
                this.togglePlayer();

                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.globals.handleError(err);
            }
        })
    }

    undoMove(col: number) {
        let undoRequest: UndoRequest = {
            board: this.board,
            move: col
        }

        this.isLoading = true;
        this.connect4Service.undo(undoRequest).subscribe({
            next: res => {
                this.board = res.board;
                this.gameState = res.gameState;

                this.moves.pop();
                this.togglePlayer();

                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.globals.handleError(err);
            }
        })
    }

    solve() {
        let solveRequest: SolveRequest = {
            board: this.board,
            player: 1,
            maxTime: 1,
            maxDepth: 1,
            tableSize: 1,
            version: 1
        };

        this.isLoading = true;
        this.connect4Service.solve(solveRequest).subscribe({
            next: res => {
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.globals.handleError(err);
            }
        })
    }

    createBoard(rows: number, cols: number): number[][] {
        return new Array(rows)
            .fill(0)
            .map(
                () => new Array(cols).fill(0)
            )
    }
}
