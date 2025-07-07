import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../../dto/sites/catan/GameState";
import {GameConfig} from "../../dto/sites/catan/GameConfig";
import {GameDetails} from "../../dto/games/GameDetails";
import {ResultState} from "../../dto/sites/catan/ResultState";

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

    save(saveGameState: ResultState, imageFile: File | null = null) {
        const formData = new FormData();
        formData.append('gameState', new Blob([JSON.stringify(saveGameState)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('image', imageFile, imageFile.name);
        }

        return this.httpClient.post<GameDetails>(this.baseUri + '/save', formData).pipe(
            tap(() => {
                this.globals.handleSuccess('Saved session data');
            }));
    }
}
