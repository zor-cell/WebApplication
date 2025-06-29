import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../dto/qwirkle/GameState";
import {Move} from "../dto/qwirkle/Move";
import {Tile} from "../dto/qwirkle/Tile";
import {PositionInfo} from "../dto/qwirkle/PositionInfo";

@Injectable({
  providedIn: 'root'
})
export class QwirkleService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/qwirkle';
  }

  getState(): Observable<GameState> {
    return this.httpClient.get<GameState>(this.baseUri + '/state', {
      context: this.globals.silentErrorContext
    });
  }

  getValidMoves(tiles: Tile[]): Observable<Move[]> {
    return this.httpClient.post<Move[]>(this.baseUri + '/moves', tiles);
  }

  getOpenPositions(): Observable<PositionInfo[]> {
    return this.httpClient.get<PositionInfo[]>(this.baseUri + '/positions');
  }

  getBestMoves(): Observable<Move[]> {
    return this.httpClient.get<Move[]>(this.baseUri + '/solve');
  }

  clearState(): Observable<void> {
    return this.httpClient.post<void>(this.baseUri + '/clear', {}).pipe(
        tap(() => {
          this.globals.handleSuccess('Cleared session data');
        }));
  }

  createState(hand: Tile[]): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/start', hand);
  }

  drawTile(tile: Tile): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/stack/draw', tile);
  }

  makeMove(move: Move): Observable<GameState> {
    return this.httpClient.post<GameState>(this.baseUri + '/move', move);
  }

  uploadImage(image: string): Observable<void> {
    return this.httpClient.post<void>(this.baseUri + '/image', image);
  }
}
