import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {MoveRequest} from "../dto/connect4/requests";
import {Observable} from "rxjs";
import {MoveResponse} from "../dto/connect4/responses";
import {ProjectDetails, ProjectMetadata} from "../dto/projects/responses";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/projects';
  }

  html(name: string): Observable<ProjectDetails> {
    return this.httpClient.get<ProjectDetails>(`${this.baseUri}/${name}`);
  }

}
