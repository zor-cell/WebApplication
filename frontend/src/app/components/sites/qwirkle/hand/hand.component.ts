import {Component, EventEmitter, inject, input, OnChanges, Output, output, signal, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Tile} from "../../../../dto/sites/qwirkle/Tile";
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {SelectionInfo} from "../../../../dto/sites/qwirkle/SelectionInfo";
import {GameState} from "../../../../dto/sites/qwirkle/GameState";

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
    hand = input.required<Tile[]>();
    handCleared = output<GameState>();
    selectionInfoChanged = output<SelectionInfo>();

    tileSize: number = 40;
    selected: Tile[] = [];
    selectionInfo: SelectionInfo | null = null;

    get paddedHand() {
        const maxHandSize = 6;
        const padded: (Tile | null)[] = [...this.hand()];
        while (padded.length < maxHandSize) {
            padded.push(null);
        }
        return padded;
    }

    private qwirkleService = inject(QwirkleService);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['hand']) {
            this.selected = [];
            this.getSelectionInfo();
        }
    }

    selectTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.hand().length - 1) return;

        const tile = this.hand()[tileIndex];
        const selectedIndex = this.selected.indexOf(tile);

        if (selectedIndex > -1) {
            this.selected.splice(selectedIndex, 1);
        } else {
            this.selected.push(tile);
        }

        this.getSelectionInfo();
    }

    protected clearHand() {
        this.qwirkleService.clearHand().subscribe(res => {
            this.handCleared.emit(res);
        })
    }

    private getSelectionInfo() {
        this.qwirkleService.getSelectionInfo(this.selected, false).subscribe(res => {
            console.log(res)
            this.selectionInfo = res;
            this.selectionInfoChanged.emit(res);
        });
    }
}
