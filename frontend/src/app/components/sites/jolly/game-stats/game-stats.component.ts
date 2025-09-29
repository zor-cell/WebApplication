import {Component, input} from '@angular/core';
import {GameStats} from "../../../../dto/sites/jolly/game/GameStats";

@Component({
  selector: 'jolly-game-stats',
  imports: [],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
  standalone: true
})
export class JollyGameStatsComponent {
  public stats = input.required<GameStats>();
}
