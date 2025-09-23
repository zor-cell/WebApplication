import {Component, inject, signal} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import {NgForOf, NgIf} from "@angular/common";
import {GameService} from "../../../../services/game.service";

@Component({
  selector: 'game-stats',
  imports: [
    MainHeaderComponent,
    GameSearchComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
  private gameService = inject(GameService);
  
  protected gameStats = signal<GameStats[]>([]);
  protected gameFilters = signal<GameFilters | null>(null);

  protected searchFiltersChanged(filters: GameFilters) {
    this.gameFilters.set(filters);
    this.getStats(filters);
  }
  
  private getStats(filters: GameFilters) {
    this.gameService.getStats(filters).subscribe(res => {
      this.gameStats.set(res);
    })
  }
}
