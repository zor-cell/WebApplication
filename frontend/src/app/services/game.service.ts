import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {GameDetails} from "../dto/games/GameDetails";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/games';
  }
  
  getGames(): Observable<GameDetails[]> {
    return this.httpClient.get<GameDetails[]>(this.baseUri);
  }
}
