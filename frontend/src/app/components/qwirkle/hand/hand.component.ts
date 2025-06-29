import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {NgForOf} from "@angular/common";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Tile} from "../../../dto/qwirkle/Tile";

@Component({
    selector: 'qwirkle-hand',
    imports: [
        NgForOf,
        QwirkleTileComponent
    ],
    templateUrl: './hand.component.html',
    standalone: true,
    styleUrl: './hand.component.css'
})
export class QwirkleHandComponent {
    private gameState: GameState | null = null;

    @Input({required: true}) hand!: Tile[];
    @Output() selectTilesEvent = new EventEmitter<Tile[]>();

    selected: Tile[] = [];

    constructor(private qwirkleService: QwirkleService,) {
    }

    tileSelected(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.hand.length - 1) return;

        const tile = this.hand[tileIndex];
        const index = this.selected.indexOf(tile);

        if(index > -1) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(tile);
        }

        this.selectTilesEvent.emit(this.selected);
    }
}
