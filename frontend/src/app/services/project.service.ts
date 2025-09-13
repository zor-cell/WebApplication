import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {ProjectMetadata} from "../dto/projects/ProjectMetadata";
import {ProjectDetails} from "../dto/projects/ProjectDetails";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private httpClient = inject(HttpClient);
    private globals = inject(Globals);

    private readonly baseUri = this.globals.backendUri + '/projects';

    getProjects(): Observable<ProjectMetadata[]> {
        return this.httpClient.get<ProjectMetadata[]>(this.baseUri);
    }

    getProject(name: string): Observable<ProjectDetails> {
        return this.httpClient.get<ProjectDetails>(`${this.baseUri}/${name}`);
    }

    updateProject(project: ProjectDetails) {
        return this.httpClient.put<ProjectDetails>(this.baseUri, project).pipe(
            tap(() => {
                this.globals.handleSuccess('Updated project');
            })
        );
    }

    createProject(project: ProjectDetails) {
        return this.httpClient.post<ProjectDetails>(this.baseUri, project).pipe(
            tap(() => {
                this.globals.handleSuccess('Created project');
            })
        );
    }
}
