import {Injectable} from '@angular/core';
import {GameConfig} from "../dto/game/GameConfig";
import {GameState} from "../dto/game/GameState";
import {GameSessionService} from "../../all/services/game-session.service";
import {Globals} from "../../../main/classes/globals";
import {HttpClient} from "@angular/common/http";
import {RoundResult} from "../dto/RoundResult";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JollyService extends GameSessionService<GameConfig, GameState> {
  protected readonly baseUri: string;

  constructor(httpClient: HttpClient, globals: Globals) {
    super(httpClient, globals);
    this.baseUri = this.globals.backendUri + '/jolly';
  }

  saveRound(results: RoundResult[], imageFile: File | null = null) {
    const formData = new FormData();
    formData.append('results', new Blob([JSON.stringify(results)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.httpClient.post<GameState>(this.baseUri + '/round', formData).pipe(
        tap(() => {
          this.globals.handleSuccess('Saved round results');
        }));;
  }
}
