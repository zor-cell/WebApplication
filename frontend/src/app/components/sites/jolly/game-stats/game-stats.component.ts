import {Component, input} from '@angular/core';
import {GameStats} from "../../../../dto/sites/jolly/game/GameStats";
import {RouterLink} from "@angular/router";
import {DurationPipe} from "../../../../pipes/DurationPipe";

@Component({
  selector: 'jolly-game-stats',
  imports: [
    RouterLink,
    DurationPipe
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
  standalone: true
})
export class JollyGameStatsComponent {
  public stats = input.required<GameStats>();
}
