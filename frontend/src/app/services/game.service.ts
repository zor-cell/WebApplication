import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {GameDetails} from "../dto/games/GameDetails";
import {Observable} from "rxjs";
import {GameMetadata} from "../dto/games/GameMetadata";

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

  getGame(id: string): Observable<GameDetails> {
    return this.httpClient.get<GameDetails>(this.baseUri + '/' + id);
  }
}
