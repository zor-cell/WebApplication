import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {MoveRequest} from "../dto/connect4/requests";
import {Observable} from "rxjs";
import {MoveResponse} from "../dto/connect4/responses";
import {GameState} from "../dto/catan/GameState";
import {GameConfig} from "../dto/catan/GameConfig";
import {DiceRoll} from "../dto/catan/DiceRoll";

@Injectable({
  providedIn: 'root'
})
export class CatanService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/catan';
  }

  getState(): Observable<GameState> {
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

  rollDice(isAlchemist: boolean): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/dice-roll',{},
        {
          withCredentials: true,
          params: {
            alchemist: isAlchemist
          }
        });
  }
}
