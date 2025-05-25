import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {Position} from "../../../dto/connect4/data";

@Component({
    selector: 'connect4-cell',
    imports: [
        NgClass
    ],
    templateUrl: './cell.component.html',
    standalone: true,
    styleUrl: './cell.component.css'
})
export class CellComponent {
    @Input() isLastMove: boolean = false;
    @Input() cellPosition: Position = {i: -1, j: -1};
    @Input() cellValue: number = 0;
    @Input() currentPlayer: number = 0;
    @Output() clickEvent = new EventEmitter<number>();

    cellColor() {
        if (this.cellValue === 1) {
            return 'red-circle';
        } else if (this.cellValue === -1) {
            return 'yellow-circle';
        } else {
            return 'white-circle';
        }
    }

    handleClick() {
        this.clickEvent.emit(this.cellPosition.j);
    }
}
