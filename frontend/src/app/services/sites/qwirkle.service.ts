import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../../classes/globals";
import {from, Observable, tap} from "rxjs";
import {GameState} from "../../dto/sites/qwirkle/GameState";
import {Move} from "../../dto/sites/qwirkle/Move";
import {Tile} from "../../dto/sites/qwirkle/Tile";
import {MoveGroup} from "../../dto/sites/qwirkle/MoveGroup";
import {SelectionInfo} from "../../dto/sites/qwirkle/SelectionInfo";

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

    getSelectionInfo(selected: Tile[], fromStack: boolean = false): Observable<SelectionInfo> {
        return this.httpClient.post<SelectionInfo>(this.baseUri + '/selection', selected, {
            params: {
                fromStack: fromStack
            }
        });
    }

    getBestMoves(maxMoves: number = 1): Observable<MoveGroup[]> {
        return this.httpClient.get<MoveGroup[]>(this.baseUri + '/solve', {
            params: {maxMoves: maxMoves.toString()}
        });
    }

    drawTile(tile: Tile): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/stack/draw', tile);
    }

    makeMove(move: Move, fromStack: boolean = false): Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/move', move, {
            params: {
                fromStack: fromStack
            }
        });
    }

    uploadImage(image: File): Observable<Blob> {
        const formData = new FormData();
        formData.append('file', image);

        return this.httpClient.post<Blob>(this.baseUri + '/image/upload', formData, {
            responseType: 'blob' as 'json'
        }) as Observable<Blob>;
    }

    confirmImage(): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/image/confirm', {});
    }
}
