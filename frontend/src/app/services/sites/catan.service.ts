import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../../dto/sites/catan/GameState";
import {GameConfig} from "../../dto/sites/catan/GameConfig";
import {GameDetails} from "../../dto/games/GameDetails";
import {ResultState} from "../../dto/sites/catan/ResultState";
import {GameSessionService} from "./game-session.service";

@Injectable({
    providedIn: 'root'
})
export class CatanService extends GameSessionService<GameConfig, GameState> {
    protected readonly baseUri: string;

    constructor(httpClient: HttpClient, globals: Globals) {
        super(httpClient, globals);
        this.baseUri = this.globals.backendUri + '/catan';
    }

    rollDice(isAlchemist: boolean): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/dice-roll', {},
            {
                params: {
                    alchemist: isAlchemist
                }
            });
    }
}
