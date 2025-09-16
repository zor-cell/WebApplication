import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Globals} from "../../classes/globals";
import {ResultState} from "../../dto/sites/catan/result/ResultState";
import {GameDetails} from "../../dto/games/GameDetails";
import {GameConfigBase} from "../../dto/sites/GameConfigBase";
import {GameStateBase} from "../../dto/sites/GameStateBase";

@Injectable({
  providedIn: 'root'
})
export abstract class GameSessionService<Config extends GameConfigBase, State extends GameStateBase> {
  protected abstract readonly baseUri: string;

  protected constructor(protected httpClient: HttpClient, protected globals: Globals) {}

  getSession(): Observable<State> {
    return this.httpClient.get<State>(this.baseUri + '/session', {
      context: this.globals.silentErrorContext
    });
  }

  createSession(config: Config): Observable<State> {
    return this.httpClient.post<State>(this.baseUri + '/session', config);
  }

  updateSession(config: Config): Observable<State> {
    return this.httpClient.put<State>(this.baseUri + '/session', config).pipe(
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
    formData.append('resultState', new Blob([JSON.stringify(resultState)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.httpClient.post<GameDetails>(this.baseUri + '/session/save', formData).pipe(
        tap(() => {
          this.globals.handleSuccess('Saved session data');
        }));
  }

  isSessionSaved(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseUri + '/session/save');
  }
  
  undoMove() : Observable<State> {
    return this.httpClient.post<State>(this.baseUri + '/session/undo', {});
  }
}
