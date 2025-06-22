import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable} from "rxjs";
import {GameState} from "../dto/catan/GameState";
import {GameConfig} from "../dto/catan/GameConfig";
import {GameDetails} from "../dto/global/GameDetails";
import {SaveGameState} from "../dto/catan/SaveGameState";

@Injectable({
  providedIn: 'root'
})
export class CatanService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/catan';
  }

  state(): Observable<GameState> {
      return this.httpClient.get<GameState>(this.baseUri + '/state', {
          withCredentials: true
      });
  }

  clear(): Observable<void> {
      return this.httpClient.post<void>(this.baseUri + '/clear', {},
          {
              withCredentials: true
          });
  }

  start(gameConfig: GameConfig): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/start', gameConfig,
        {
          withCredentials: true
        });
  }

    update(gameConfig: GameConfig): Observable<GameState> {
        return this.httpClient.put<GameState>(this.baseUri + '/update', gameConfig,
            {
                withCredentials: true
            });
    }

  rollDice(isAlchemist: boolean): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/dice-roll',{},
        {
          withCredentials: true,
          params: {
            alchemist: isAlchemist
          }
        });
  }

  save(saveGameState: SaveGameState) {
      return this.httpClient.post<GameDetails>(this.baseUri + '/save', saveGameState,
          {
          withCredentials: true,
      });
  }
}
