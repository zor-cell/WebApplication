import {Component, signal} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/GameStats";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'game-stats',
  imports: [
    MainHeaderComponent,
    GameSearchComponent,
    NgForOf
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
  protected gameStats = signal<GameStats[]>([]);

  ngOnInit() {
    const temp: GameStats = {
      winRate: 0.7,
      avgScore: 12,
      maxScore: 14,
      nemesis: null,
      victim: null,
      rival: null,
      companion: null,
      startPosCor: 0.7
    };
    this.gameStats.set([temp]);
  }

  protected searchFiltersChanged(filters: GameFilters) {
    console.log(filters)
  }
}
