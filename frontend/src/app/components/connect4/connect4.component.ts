import { Component } from '@angular/core';
import {CellComponent} from "./cell/cell.component";
import {NgForOf} from "@angular/common";

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

  get transposedBoard() {
      return this.board[0].map((_, colIndex) =>
          this.board.map(row => row[colIndex])
      );
  }

  createBoard(rows: number, cols: number): number[][] {
      return [
          //0, 1, 2, 3, 4, 5, 6
          [0, 0, 0, 0, 0, 0, 0],   //0
          [0, 0, 0, 0, 0, 0, 0],   //1
          [0, 0, 0, 0, 0, 0, 0],   //2
          [0, 0, 0, 0, 0, 0, 0],   //3
          [0, 0, 1, 0, 0, 0, 0],   //4
          [0, 0, -1, -1, 0, 0, 0],   //5
          //0, 1, 2, 3, 4, 5, 6
      ];

    return new Array(rows)
        .fill(0)
        .map(
            () => new Array(cols).fill(0)
        )
  }

    protected readonly Array = Array;
}
