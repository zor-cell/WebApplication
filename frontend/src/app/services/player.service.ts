import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {PlayerDetails} from "../dto/all/PlayerDetails";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private readonly baseUri: string;

    constructor(private httpClient: HttpClient, private globals: Globals) {
        this.baseUri = this.globals.backendUri + '/players';
    }

    getPlayers(): Observable<PlayerDetails[]> {
        return this.httpClient.get<PlayerDetails[]>(this.baseUri);
    }

    getPlayer(name: string): Observable<PlayerDetails> {
        return this.httpClient.get<PlayerDetails>(`${this.baseUri}/${name}`);
    }

    savePlayer(player: PlayerDetails): Observable<PlayerDetails> {
        return this.httpClient.post<PlayerDetails>(`${this.baseUri}/save`, player).pipe(
            tap(() => {
                this.globals.handleSuccess('Saved player data');
            }));
    }
}
