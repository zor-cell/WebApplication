import { Component } from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NgForOf} from "@angular/common";
import {Connect4Service} from "../../services/connect4.service";
import {MoveRequest, SolveRequest, UndoRequest} from "../../dto/connect4/requests";
import {GameState} from "../../dto/connect4/data";
import {Globals} from "../../classes/globals";

@Component({
  selector: 'app-connect4',
    imports: [
        CellComponent,
        NgForOf
    ],
  templateUrl: './connect4.component.html',
  standalone: true,
  styleUrl: './connect4.component.css'
})
export class Connect4Component {
  board: number[][] = this.createBoard(6, 7);
  currentPlayer: number = 1;
  gameOver: boolean = false;
  gameState: GameState = GameState.RUNNING;
  moves: number[] = Array(0);
  isLoading: boolean = false;

  constructor(private globals: Globals, private connect4Service: Connect4Service) {
      this.makeMove(3);
  }

    togglePlayer(): void {
      this.currentPlayer = this.currentPlayer === 1 ? -1 : 1;
    }

  makeMove(col: number) {
      if(this.gameOver) return;

      let moveRequest: MoveRequest = {
        board: this.board,
        player: this.currentPlayer,
        move: col
      };

      console.log(moveRequest)
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

    protected readonly Array = Array;
}
