import {Component, input, Type} from '@angular/core';
import {GameStatsMetrics} from "../../../../dto/games/stats/GameStatsMetrics";
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";

@Component({
  selector: 'game-stats-metrics',
  imports: [
    GameStatsMetaComponent
  ],
  templateUrl: './game-stats-metrics.component.html',
  standalone: true,
  styleUrl: './game-stats-metrics.component.css'
})
export class GameStatsMetricsComponent {
  public metric = input.required<GameStatsMetrics<any>>();
  public label = input.required<string>();
  public pipe = input<Type<any>>();
}
