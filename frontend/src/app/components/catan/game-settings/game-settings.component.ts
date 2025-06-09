import {Component, EventEmitter, Output} from '@angular/core';
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../dto/catan/GameConfig";
import {CatanService} from "../../../services/catan.service";
import {Globals} from "../../../classes/globals";
import {GameState} from "../../../dto/catan/GameState";
import {PlayerConfig} from "../../../dto/connect4/data";

@Component({
  selector: 'catan-game-settings',
  imports: [
    SliderCheckboxComponent,
    NgOptimizedImage,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './game-settings.component.html',
  standalone: true,
  styleUrl: './game-settings.component.css'
})
export class GameSettingsComponent {
  @Output() gameStateEvent = new EventEmitter<GameState>();
  gameConfig: GameConfig = {
    players: [],
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
  playerName: string = "";
  gameState: GameState | null = null;

  constructor(private globals: Globals, private catanService: CatanService) {}

  isValidPlayerName(name: string) {
    return name != "" && this.gameConfig.players.length < 4 && !this.gameConfig.players.includes(name);
  }

  addPlayer(player: string) {
    if(!this.isValidPlayerName(player)) return;

    this.gameConfig.players.push(player);
    this.playerName = "";
  }

  removePlayer(player: string) {
    const index = this.gameConfig.players.indexOf(player);
    if(index < 0) return;

    this.gameConfig.players.splice(index, 1);
  }

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
