import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpParams} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../dto/catan/GameState";
import {GameConfig} from "../dto/catan/GameConfig";
import {GameDetails} from "../dto/global/GameDetails";
import {SaveGameState} from "../dto/catan/SaveGameState";
import {SILENT_ERROR_HANDLER} from "../classes/interceptors";

@Injectable({
    providedIn: 'root'
})
export class CatanService {
    private readonly baseUri: string;

    constructor(private httpClient: HttpClient, private globals: Globals) {
        this.baseUri = this.globals.backendUri + '/catan';
    }

    state(): Observable<GameState> {
        return this.httpClient.get<GameState>(this.baseUri + '/state', {
            context: this.globals.silentErrorContext
        });
    }

    rollDice(isAlchemist: boolean): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/dice-roll', {},
            {
                params: {
                    alchemist: isAlchemist
                }
            });
    }

    start(gameConfig: GameConfig): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/start', gameConfig);
    }

    clear(): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/clear', {}).pipe(
            tap(() => {
                this.globals.handleSuccess('Cleared session data');
            }));
    }

    update(gameConfig: GameConfig): Observable<GameState> {
        return this.httpClient.put<GameState>(this.baseUri + '/update', gameConfig).pipe(
            tap(() => {
                this.globals.handleSuccess('Updated session data');
            }));
    }

    save(saveGameState: SaveGameState) {
        return this.httpClient.post<GameDetails>(this.baseUri + '/save', saveGameState).pipe(
            tap(() => {
                this.globals.handleSuccess('Saved session data');
            }));
    }
}
