import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../../classes/globals";
import {Observable} from "rxjs";
import {GameState} from "../../dto/sites/qwirkle/game/GameState";
import {Move} from "../../dto/sites/qwirkle/move/Move";
import {Tile} from "../../dto/sites/qwirkle/tile/Tile";
import {MoveGroup} from "../../dto/sites/qwirkle/move/MoveGroup";
import {SelectionInfo} from "../../dto/sites/qwirkle/SelectionInfo";
import {GameSessionService} from "./game-session.service";
import {GameConfig} from "../../dto/sites/qwirkle/game/GameConfig";
import {State} from "@popperjs/core";

@Injectable({
    providedIn: 'root'
})
export class QwirkleService extends GameSessionService<GameConfig, GameState> {
    protected readonly baseUri: string;

    constructor(httpClient: HttpClient, globals: Globals) {
        super(httpClient, globals);
        this.baseUri = this.globals.backendUri + '/qwirkle';
    }

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

    undoMove() : Observable<GameState> {
        return this.httpClient.post<GameState>(this.baseUri + '/undo', {});
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
