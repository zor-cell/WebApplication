import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {GameState} from "../dto/qwirkle/GameState";
import {Move} from "../dto/qwirkle/Move";
import {Tile} from "../dto/qwirkle/Tile";
import {MoveGroup} from "../dto/qwirkle/MoveGroup";
import {HandInfo} from "../dto/qwirkle/HandInfo";
import {SelectionInfo} from "../dto/qwirkle/SelectionInfo";

@Injectable({
    providedIn: 'root'
})
export class QwirkleService {
    private readonly baseUri: string;

    constructor(private httpClient: HttpClient, private globals: Globals) {
        this.baseUri = this.globals.backendUri + '/qwirkle';
    }

    //session management
    clearState(): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/clear', {}).pipe(
            tap(() => {
                this.globals.handleSuccess('Cleared session data');
            }));
    }

    getState(): Observable<GameState> {
        return this.httpClient.get<GameState>(this.baseUri + '/state', {
            context: this.globals.silentErrorContext
        });
    }

    createState(): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/start', {});
    }

    //qwirkle management
    clearHand(): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/hand/clear', {});
    }

    getSelectionInfo(selected: Tile[]): Observable<SelectionInfo> {
        return this.httpClient.post<SelectionInfo>(this.baseUri + '/hand/selection', selected);
    }

    getBestMoves(maxMoves: number = 1): Observable<MoveGroup[]> {
        return this.httpClient.get<MoveGroup[]>(this.baseUri + '/solve', {
            params: {maxMoves: maxMoves.toString()}
        });
    }

    drawTile(tile: Tile): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/stack/draw', tile);
    }

    makeMove(move: Move): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/move', move);
    }

    uploadImage(image: File): Observable<void> {
        const formData = new FormData();
        formData.append('file', image);

        return this.httpClient.post<void>(this.baseUri + '/image', formData);
    }
}
