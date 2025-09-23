import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {GameDetails} from "../dto/games/GameDetails";
import {Observable, tap} from "rxjs";
import {GameMetadata} from "../dto/games/GameMetadata";
import {GameFilters} from "../dto/games/GameFilters";
import {GameStats} from "../dto/games/GameStats";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private httpClient = inject(HttpClient);
  private globals = inject(Globals);

  private readonly baseUri = this.globals.backendUri + '/games';
  
  getGames(): Observable<GameMetadata[]> {
    return this.httpClient.get<GameMetadata[]>(this.baseUri);
  }

  searchGames(gameFilters: GameFilters): Observable<GameMetadata[]> {
    const params = this.filtersToParams(gameFilters);
    return this.httpClient.get<GameMetadata[]>(this.baseUri + '/search', {params});
  }

  getStats(gameFilters: GameFilters): Observable<GameStats[]> {
    const params = this.filtersToParams(gameFilters);
    return this.httpClient.get<GameStats[]>(this.baseUri + '/stats', {params});
  }

  getGame(id: string): Observable<GameDetails> {
    return this.httpClient.get<GameDetails>(this.baseUri + '/' + id);
  }

  deleteGame(id: string) {
    return this.httpClient.delete<GameDetails>(this.baseUri + '/' + id).pipe(
        tap(() => {
          this.globals.handleSuccess('Deleted game data');
        }));
  }

  private filtersToParams(gameFilters: GameFilters): HttpParams {
    let params = new HttpParams();
    for (const key in gameFilters) {
      const value = (gameFilters as any)[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    }
    return params;
  }
}
