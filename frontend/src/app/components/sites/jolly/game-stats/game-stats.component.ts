import {Component, input} from '@angular/core';
import {GameStats} from "../../../../dto/sites/jolly/game/GameStats";
import {RouterLink} from "@angular/router";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {GameStatsMetaComponent} from "../../../games/stats/game-stats-meta/game-stats-meta.component";

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
