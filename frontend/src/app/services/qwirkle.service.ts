import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../dto/qwirkle/GameState";
import {Move} from "../dto/qwirkle/Move";
import {Tile} from "../dto/qwirkle/Tile";
import {MoveGroup} from "../dto/qwirkle/MoveGroup";
import {HandInfo} from "../dto/qwirkle/HandInfo";

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

    getValidMoves(tiles: Tile[]): Observable<MoveGroup[]> {
        return this.httpClient.post<MoveGroup[]>(this.baseUri + '/moves', tiles);
    }

    getBestMoves(maxMoves: number = 1): Observable<MoveGroup[]> {
        return this.httpClient.get<MoveGroup[]>(this.baseUri + '/solve', {
            params: {maxMoves: maxMoves.toString()}
        });
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

    clearHand(): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/hand/clear', {});
    }

    validateHand(selected: Tile[]): Observable<HandInfo[]> {
        return this.httpClient.post<HandInfo[]>(this.baseUri + '/hand/valid', selected);
    }

    makeMove(move: Move): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/move', move);
    }

    uploadImage(image: string): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/image', image);
    }
}
