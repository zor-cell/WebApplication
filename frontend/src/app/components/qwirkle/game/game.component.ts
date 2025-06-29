import { Component } from '@angular/core';
import {QwirkleHandComponent} from "../hand/hand.component";
import {QwirkleStackComponent} from "../stack/stack.component";
import {MainHeaderComponent} from "../../global/main-header/main-header.component";
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {Hand} from "../../../dto/qwirkle/Hand";
import {NgIf} from "@angular/common";

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
        tiles: []
    }

    constructor(private qwirkleService: QwirkleService) {
    }

    ngOnInit() {
        this.getOrCreateState();
    }

    getOrCreateState() {
        this.qwirkleService.getState().subscribe({
            next: res => {
                this.gameState = res;
            }
        });
    }

    createState() {
        this.qwirkleService.createState(this.hand).subscribe({
            next: res =>{
                this.gameState = res;
            }
        });
    }
}
