import {Component} from '@angular/core';
import {QwirkleHandComponent} from "../hand/hand.component";
import {QwirkleStackComponent} from "../stack/stack.component";
import {MainHeaderComponent} from "../../global/main-header/main-header.component";
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {Hand} from "../../../dto/qwirkle/Hand";
import {NgIf} from "@angular/common";
import {Shape} from "../../../dto/qwirkle/Shape";
import {Color} from "../../../dto/qwirkle/Color";
import {Tile} from "../../../dto/qwirkle/Tile";

@Component({
    selector: 'qwirkle-game',
    imports: [
        QwirkleHandComponent,
        QwirkleStackComponent,
        MainHeaderComponent,
        NgIf
    ],
    templateUrl: './game.component.html',
    standalone: true,
    styleUrl: './game.component.css'
})
export class QwirkleGameComponent {
    gameState: GameState | null = null;
    hand: Hand = {
        tiles: [
            {color: Color.BLUE, shape: Shape.CLOVER}
        ]
    };

    constructor(private qwirkleService: QwirkleService) {
    }

    ngOnInit() {
        this.getOrCreateState();
    }

    selectedInStack(tile: Tile) {
        this.drawTile(tile);
    }

    private drawTile(tile: Tile) {
        this.qwirkleService.drawTile(tile).subscribe({
            next: res => {
                this.gameState = res;
            }
        })
    }

    private getOrCreateState() {
        this.qwirkleService.getState().subscribe({
            next: res => {
                this.gameState = res;
            }
        });
    }

    createState() {
        this.qwirkleService.createState(this.hand).subscribe({
            next: res => {
                this.gameState = res;
            }
        });
    }
}
