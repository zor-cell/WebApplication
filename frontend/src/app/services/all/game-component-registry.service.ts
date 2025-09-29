import {inject, Injectable, Type} from '@angular/core';
import {GameType} from "../../dto/games/GameType";
import {CatanGameInfoComponent} from "../../components/sites/catan/game-info/game-info.component";
import {CatanGameStatsComponent} from "../../components/sites/catan/game-stats/game-stats.component";
import {JollyGameInfoComponent} from "../../components/sites/jolly/game-info/game-info.component";
import {JollyGameStatsComponent} from "../../components/sites/jolly/game-stats/game-stats.component";

@Injectable({
  providedIn: 'root'
})
export class GameComponentRegistryService {
  private gameInfoComponents: Partial<Record<GameType, Type<any>>> = {
    [GameType.CATAN]: CatanGameInfoComponent,
    [GameType.JOLLY]: JollyGameInfoComponent
  };

  private gameStatsComponents: Partial<Record<GameType, Type<any>>> = {
    [GameType.CATAN]: CatanGameStatsComponent,
    [GameType.JOLLY]: JollyGameStatsComponent
  };

  getInfoComponent(gameType: GameType) {
    return this.gameInfoComponents[gameType];
  }

  getStatsComponent(gameType: GameType) {
    return this.gameStatsComponents[gameType];
  }
}
