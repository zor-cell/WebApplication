import {Injectable} from '@angular/core';
import {GameConfig} from "../../dto/sites/jolly/game/GameConfig";
import {GameState} from "../../dto/sites/jolly/game/GameState";
import {GameSessionService} from "./game-session.service";
import {Globals} from "../../classes/globals";
import {HttpClient} from "@angular/common/http";
import {RoundResult} from "../../dto/sites/jolly/RoundResult";

@Injectable({
  providedIn: 'root'
})
export class JollyService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string;

  constructor(httpClient: HttpClient, globals: Globals) {
    super(httpClient, globals);
    this.baseUri = this.globals.backendUri + '/jolly';
  }

  saveRound(results: RoundResult[]) {
    return this.httpClient.post<GameState>(this.baseUri + '/round', results);
  }
}
