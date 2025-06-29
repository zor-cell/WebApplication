import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StackTile} from "../../../dto/qwirkle/StackTile";
import {QwirkleTileComponent} from "../tile/tile.component";
import {NgForOf} from "@angular/common";
import {Tile} from "../../../dto/qwirkle/Tile";

@Component({
    selector: 'qwirkle-stack',
    imports: [
        QwirkleTileComponent,
        NgForOf
    ],
    templateUrl: './stack.component.html',
    standalone: true,
    styleUrl: './stack.component.css'
})
export class QwirkleStackComponent {
    @Input({required: true}) stack: StackTile[] = [];

    @Output() selectTileEvent = new EventEmitter<Tile>();

    selectedTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.stack.length - 1) return;

        const stackTile = this.stack[tileIndex];

        if (stackTile.count >= 1) {
            this.selectTileEvent.emit(stackTile.tile);
        }
    }
}
