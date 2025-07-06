import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {Globals} from "../../../classes/globals";
import {ProjectMetadata} from "../../../dto/projects/responses";
import {NgForOf} from "@angular/common";
import {ProjectCardComponent} from "../project-card/project-card.component";

@Component({
    selector: 'project-list',
    imports: [NgForOf, ProjectCardComponent],
    templateUrl: './project-list.component.html',
    standalone: true,
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    projects!: ProjectMetadata[];

    constructor(private globals: Globals, private projectService: ProjectService) {
    }

    ngOnInit(): void {
        this.getProjects();
    }


    getProjects() {
        this.projectService.getProjects().subscribe({
            next: res => {
                this.projects = res;
            }
        });
    }
}
