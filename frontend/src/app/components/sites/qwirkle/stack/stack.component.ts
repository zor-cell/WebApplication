import {Component, effect, inject, input, output} from '@angular/core';
import {StackTile} from "../../../../dto/sites/qwirkle/tile/StackTile";
import {QwirkleTileComponent} from "../tile/tile.component";
import {NgForOf} from "@angular/common";
import {Tile} from "../../../../dto/sites/qwirkle/tile/Tile";
import {FormsModule} from "@angular/forms";
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {GameState} from "../../../../dto/sites/qwirkle/game/GameState";
import {SelectionInfo} from "../../../../dto/sites/qwirkle/SelectionInfo";
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";

@Component({
    selector: 'qwirkle-stack',
    imports: [
        QwirkleTileComponent,
        NgForOf,
        FormsModule,
        SliderCheckboxComponent
    ],
    templateUrl: './stack.component.html',
    standalone: true,
    styleUrl: './stack.component.css'
})
export class QwirkleStackComponent {
    stack = input.required<StackTile[]>();
    tileDrawn = output<GameState>();
    tileSelected = output<SelectionInfo>();
    editModeChanged = output<boolean>();

    protected editMode: boolean = false;
    protected selected: Tile[] = [];

    private changeEffect = effect(() => {
        //detect stack changes
        const change = this.stack();
        this.resetSelection();
    });
    private qwirkleService = inject(QwirkleService);

    changeEditMode(editMode: boolean) {
        this.resetSelection();

        this.editModeChanged.emit(editMode);
        this.editMode = editMode;
    }

    selectTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.stack().length - 1) return;

        const stackTile = this.stack()[tileIndex];
        if (stackTile.count <= 0) return;

        if (this.editMode) {
            const tile = stackTile.tile;
            const selectedIndex = this.selected.indexOf(tile);
            if(selectedIndex > -1) {
                this.selected.splice(selectedIndex, 1);
            } else {
                this.selected.push(tile)
            }

            this.getSelectionInfo();
        } else {
            this.drawTile(stackTile.tile);
        }
    }

    private resetSelection() {
        this.selected = [];
        if(this.editMode) {
            this.getSelectionInfo();
        }
    }

    private drawTile(tile: Tile) {
        this.qwirkleService.drawTile(tile).subscribe(res => {
            this.tileDrawn.emit(res);
        });
    }

    private getSelectionInfo() {
        this.qwirkleService.getSelectionInfo(this.selected, true).subscribe(res => {
            this.tileSelected.emit(res);
        });
    }
}
