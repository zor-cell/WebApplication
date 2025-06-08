import { Component } from '@angular/core';
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {DiceConfig} from "../../../dto/catan/data";
import {FormsModule} from "@angular/forms";

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
  classicDice: DiceConfig = {
    isBalanced: true,
    cards: [],
    shuffleThreshold: 5,
    cardsLeft: []
  };
  eventDice: DiceConfig = {
    isBalanced: false,
    cards: [],
    shuffleThreshold: 5,
    cardsLeft: []
  };
  playerName: string = "";
  players: string[] = [];

  isValidPlayerName(name: string) {
    return name != "" && this.players.length < 4 && !this.players.includes(name);
  }

  addPlayer(player: string) {
    if(!this.isValidPlayerName(player)) return;

    this.players.push(player);
    this.playerName = "";
  }

  removePlayer(player: string) {
    const index = this.players.indexOf(player);
    if(index < 0) return;

    this.players.splice(index, 1);
  }
}
