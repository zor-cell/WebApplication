import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable} from "rxjs";
import {ProjectDetails, ProjectMetadata} from "../dto/projects/responses";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUri: string;

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.baseUri = this.globals.backendUri + '/projects';
  }

  getProjects(): Observable<ProjectMetadata[]> {
    return this.httpClient.get<ProjectMetadata[]>(this.baseUri);
  }

  getProject(name: string): Observable<ProjectDetails> {
    return this.httpClient.get<ProjectDetails>(`${this.baseUri}/${name}`);
  }

}
