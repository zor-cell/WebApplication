import {Component, input} from '@angular/core';
import {GameMetadata} from "../../../../dto/games/GameMetadata";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {ResultState} from "../../../../dto/sites/catan/result/ResultState";
import {GameResultTableComponent} from "../../../games/game-result-table/game-result-table.component";
import {NgIf} from "@angular/common";
import {JollyRoundTableComponent} from "../rounds-table/round-table.component";

@Component({
  selector: 'jolly-game-info',
  imports: [
    GameResultTableComponent,
    NgIf,
    JollyRoundTableComponent
  ],
  templateUrl: './game-info.component.html',
  standalone: true,
  styleUrl: './game-info.component.css'
})
export class JollyGameInfoComponent {
  public metadata = input.required<GameMetadata>();
  public gameState = input.required<GameState>();
  public resultState = input.required<ResultState>();
}
