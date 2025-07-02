import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Tile} from "../../../dto/qwirkle/Tile";

@Component({
    selector: 'qwirkle-hand',
    imports: [
        NgForOf,
        QwirkleTileComponent,
        NgStyle,
        NgIf
    ],
    templateUrl: './hand.component.html',
    standalone: true,
    styleUrl: './hand.component.css'
})
export class QwirkleHandComponent implements OnChanges {
    @Input({required: true}) hand!: Tile[];
    @Output() selectTilesEvent = new EventEmitter<Tile[]>();
    @Output() clearTilesEvent = new EventEmitter<void>();
    tileSize: number = 40;

    selected: Tile[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['hand']) {
            this.selected = [];
            this.updateSelected();
        }
    }

    get paddedHand() {
        const maxHandSize = 6;
        const padded: (Tile | null)[] = [...this.hand];
        while (padded.length < maxHandSize) {
            padded.push(null);
        }
        return padded;
    }

    tilesCleared() {
        //this.selected = [];
        //this.updateSelected();

        this.clearTilesEvent.emit();
    }

    tileSelected(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.hand.length - 1) return;

        const tile = this.hand[tileIndex];
        const index = this.selected.indexOf(tile);

        if (index > -1) {
            this.selected.splice(index, 1);
        } else {
            this.selected.push(tile);
        }

        this.updateSelected();
    }

    private updateSelected() {
        this.selectTilesEvent.emit(this.selected);
    }

    protected readonly Array = Array;
}
