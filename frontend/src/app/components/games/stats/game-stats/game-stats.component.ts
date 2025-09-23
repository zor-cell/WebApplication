import {Component, inject, signal, Type} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {GameService} from "../../../../services/game.service";
import {GameType} from "../../../../dto/games/GameType";
import {CatanGameInfoComponent} from "../../../sites/catan/game-info/game-info.component";
import {JollyGameInfoComponent} from "../../../sites/jolly/game-info/game-info.component";
import {CatanGameStatsComponent} from "../../../sites/catan/game-stats/game-stats.component";

@Component({
  selector: 'game-stats',
  imports: [
    MainHeaderComponent,
    GameSearchComponent,
    NgForOf,
    NgIf,
    NgComponentOutlet
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
  private gameService = inject(GameService);
  
  protected gameStats = signal<GameStats[]>([]);
  protected gameFilters = signal<GameFilters | null>(null);

  private componentMap: Partial<Record<GameType, Type<any>>> = {
    [GameType.CATAN]: CatanGameStatsComponent
  };

  protected get gameStatsComponent() {
    const gameTypes = this.gameFilters()?.gameTypes;
    if(!gameTypes || gameTypes.length !== 1) return null;

    return this.componentMap[gameTypes[0]];
  }

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
