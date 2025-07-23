import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {GameState} from "../../dto/sites/qwirkle/GameState";
import {Globals} from "../../classes/globals";
import {ResultState} from "../../dto/sites/catan/ResultState";
import {GameDetails} from "../../dto/games/GameDetails";
import {GameConfig} from "../../dto/sites/catan/GameConfig";

@Injectable({
  providedIn: 'root'
})
export abstract class GameSessionService<T, R> {
  protected abstract readonly baseUri: string;

  protected constructor(protected httpClient: HttpClient, protected globals: Globals) {}

  getSession(): Observable<R> {
    return this.httpClient.get<R>(this.baseUri + '/session', {
      context: this.globals.silentErrorContext
    });
  }

  createSession(config: T): Observable<R> {
    return this.httpClient.post<R>(this.baseUri + '/session', config);
  }

  updateSession(config: T): Observable<R> {
    return this.httpClient.put<R>(this.baseUri + '/session', config).pipe(
        tap(() => {
          this.globals.handleSuccess('Updated session data');
        }));
  }

  clearSession(): Observable<void> {
    return this.httpClient.delete<void>(this.baseUri + '/session').pipe(
        tap(() => {
          this.globals.handleSuccess('Cleared session data');
        }));
  }
  
  saveSession(resultState: ResultState, imageFile: File | null = null): Observable<GameDetails> {
    const formData = new FormData();
    formData.append('gameState', new Blob([JSON.stringify(resultState)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.httpClient.post<GameDetails>(this.baseUri + '/session/save', formData).pipe(
        tap(() => {
          this.globals.handleSuccess('Saved session data');
        }));
  }
}
