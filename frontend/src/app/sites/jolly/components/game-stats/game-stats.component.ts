import {Component, input} from '@angular/core';
import {GameStats} from "../../dto/game/GameStats";
import {DurationPipe} from "../../../../main/pipes/DurationPipe";
import {GameStatsMetaComponent} from "../../../../main/components/games/stats/game-stats-meta/game-stats-meta.component";

@Component({
  selector: 'jolly-game-stats',
    imports: [
        DurationPipe,
        GameStatsMetaComponent
    ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
  standalone: true
})
export class JollyGameStatsComponent {
  public stats = input.required<GameStats>();
}
