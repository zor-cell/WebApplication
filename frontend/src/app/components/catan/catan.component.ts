import { Component } from '@angular/core';
import {GameSettingsComponent} from "./game-settings/game-settings.component";
import {GameState} from "../../dto/catan/GameState";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-catan',
  imports: [
    GameSettingsComponent,
    NgIf
  ],
  templateUrl: './catan.component.html',
  standalone: true,
  styleUrl: './catan.component.css'
})
export class CatanComponent {
  gameState: GameState | null = null;
  gameStarted: boolean = false;
}
