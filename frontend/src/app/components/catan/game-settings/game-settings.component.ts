import {Component, EventEmitter, Output} from '@angular/core';
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../dto/catan/GameConfig";
import {CatanService} from "../../../services/catan.service";
import {Globals} from "../../../classes/globals";
import {GameState} from "../../../dto/catan/GameState";
import {PlayerConfig} from "../../../dto/connect4/data";
import {PlayerSelectComponent} from "../../global/player-select/player-select.component";

@Component({
  selector: 'catan-game-settings',
  imports: [
    SliderCheckboxComponent,
    NgOptimizedImage,
    FormsModule,
    NgForOf,
    NgIf,
    PlayerSelectComponent
  ],
  templateUrl: './game-settings.component.html',
  standalone: true,
  styleUrl: './game-settings.component.css'
})
export class GameSettingsComponent {
  @Output() gameStateEvent = new EventEmitter<GameState>();
  gameConfig: GameConfig = {
    teams: [],
    classicDice: {
      isBalanced: true,
      shuffleThreshold: 5
    },
    eventDice: {
      isBalanced: false,
      shuffleThreshold: 5
    },
    maxShipTurns: 7
  };
  gameState: GameState | null = null;

  constructor(private globals: Globals, private catanService: CatanService) {}

  clear() {
    this.catanService.clear().subscribe({
      next: res => {

      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  startGame() {
    this.catanService.start(this.gameConfig).subscribe({
      next: res => {
        this.gameState = res;

        this.gameStateEvent.emit(this.gameState);
      },
      error: err => {
        this.globals.handleError(err);
      }
    })
  }
}
