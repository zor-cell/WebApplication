import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NgForOf, NgIf} from "@angular/common";
import {Connect4Service} from "../../services/connect4.service";
import {MoveRequest, SolveRequest, UndoRequest} from "../../dto/connect4/requests";
import {GameState, PlayerConfig} from "../../dto/connect4/data";
import {Globals} from "../../classes/globals";
import {PlayerSettingsComponent} from "./player-settings/player-settings.component";

@Component({
    selector: 'app-connect4',
    imports: [
        CellComponent,
        NgForOf,
        PlayerSettingsComponent,
        NgIf
    ],
    templateUrl: './connect4.component.html',
    standalone: true,
    styleUrl: './connect4.component.css'
})
export class Connect4Component  {
    board!: number[][];
    gameOver!: boolean;
    gameState!: GameState;
    moves!: number[];
    isLoading!: boolean

    player1!: PlayerConfig;
    player2!: PlayerConfig;
    currentPlayer: PlayerConfig | undefined = undefined;

    constructor(private globals: Globals, private connect4Service: Connect4Service) {
        this.refresh();
    }

    initPlayer1(config: PlayerConfig) {
        this.player1 = config;

        //first init
        if(this.currentPlayer === undefined) {
            this.currentPlayer = this.player1;
        }
    }

    initPlayer2(config: PlayerConfig) {
        this.player2 = config;
    }

    togglePlayer(): void {
        if(!this.currentPlayer) return;

        this.currentPlayer = this.currentPlayer.value === this.player1.value ? this.player2 : this.player1;
    }

    refresh(): void {
        this.board = this.createBoard(6, 7);
        this.gameOver = false;
        this.currentPlayer = this.player1;
        this.gameState = GameState.RUNNING;
        this.moves = new Array(0);
        this.isLoading = false;
    }

    makeMove(col: number) {
        if (this.gameOver || !this.currentPlayer) return;

        let moveRequest: MoveRequest = {
            board: this.board,
            player: this.currentPlayer.value,
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

    solve(player: PlayerConfig) {
        if(this.gameOver || !this.currentPlayer) return;

        let solveRequest: SolveRequest = {
            board: this.board,
            player: player.value,
            maxTime: player.maxTime,
            maxDepth: -1,
            tableSize: player.maxMemory,
            version: player.version
        };

        this.isLoading = true;
        this.connect4Service.solve(solveRequest).subscribe({
            next: res => {
                this.board = res.board;
                this.gameState = res.gameState;

                this.moves.push(res.move);
                this.togglePlayer();

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
