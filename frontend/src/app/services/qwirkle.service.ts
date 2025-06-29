import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable} from "rxjs";
import {GameState} from "../dto/catan/GameState";

@Injectable({
  providedIn: 'root'
})
export class QwirkleService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/qwirkle';
  }

  state(): Observable<GameState> {
    return this.httpClient.get<GameState>(this.baseUri + '/state', {
      context: this.globals.silentErrorContext
    });
  }
}
