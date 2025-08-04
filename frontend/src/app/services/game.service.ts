import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {GameDetails} from "../dto/games/GameDetails";
import {Observable} from "rxjs";
import {GameMetadata} from "../dto/games/GameMetadata";
import {GameFilters} from "../dto/games/GameFilters";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/games';
  }
  
  getGames(): Observable<GameMetadata[]> {
    return this.httpClient.get<GameMetadata[]>(this.baseUri);
  }

  searchGames(gameFilters: GameFilters): Observable<GameMetadata[]> {
    let params = new HttpParams();
    for (const key in gameFilters) {
      const value = (gameFilters as any)[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    }

    return this.httpClient.get<GameMetadata[]>(this.baseUri + '/search', {params});
  }

  getGame(id: string): Observable<GameDetails> {
    return this.httpClient.get<GameDetails>(this.baseUri + '/' + id);
  }

  deleteGame(id: string) {
    return this.httpClient.delete<GameDetails>(this.baseUri + '/' + id);
  }
}
