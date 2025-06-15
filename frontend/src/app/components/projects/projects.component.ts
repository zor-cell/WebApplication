import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {Globals} from "../../classes/globals";
import {ProjectMetadata} from "../../dto/projects/responses";
import {NgForOf} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";

@Component({
    selector: 'app-projects',
    imports: [NgForOf, ProjectCardComponent],
    templateUrl: './projects.component.html',
    standalone: true,
    styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
    projects!: ProjectMetadata[];

    constructor(private globals: Globals, private projectService: ProjectService) {}

    ngOnInit(): void {
        this.getProjects();
    }


    getProjects() {
        this.projectService.getProjects().subscribe({
            next: res => {
                this.projects = res;
            },
            error: err => {
                this.globals.handleError(err);
            }
        });
    }
}
