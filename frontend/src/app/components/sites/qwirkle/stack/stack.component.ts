import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {StackTile} from "../../../../dto/sites/qwirkle/StackTile";
import {QwirkleTileComponent} from "../tile/tile.component";
import {NgClass, NgForOf} from "@angular/common";
import {Tile} from "../../../../dto/sites/qwirkle/Tile";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'qwirkle-stack',
    imports: [
        QwirkleTileComponent,
        NgForOf,
        FormsModule,
        NgClass
    ],
    templateUrl: './stack.component.html',
    standalone: true,
    styleUrl: './stack.component.css'
})
export class QwirkleStackComponent {
    @Input({required: true}) stack: StackTile[] = [];
    @Output() selectTileEvent = new EventEmitter<Tile>();
    @Output() updateFromStackEvent = new EventEmitter<boolean>();

    fromStack: boolean = false;
    selectedIndex: number | null = null;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        //unselect a move when clicking anywhere except on it
        if (!target.closest('.stack-container')) {
            //this.selectedIndex = null;
        }
    }

    selectedTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.stack.length - 1) return;

        const stackTile = this.stack[tileIndex];

        if (stackTile.count >= 1) {
            this.updateFromStackEvent.emit(this.fromStack);
            this.selectTileEvent.emit(stackTile.tile);

            if(this.fromStack) {
                this.selectedIndex = tileIndex;
            } else {
                this.selectedIndex = null;
            }
        }
    }
}
