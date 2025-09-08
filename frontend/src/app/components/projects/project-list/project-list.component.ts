import {Component, inject, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {Globals} from "../../../classes/globals";
import {ProjectMetadata} from "../../../dto/projects/ProjectMetadata";
import {NgForOf} from "@angular/common";
import {ProjectCardComponent} from "../project-card/project-card.component";
import {MainHeaderComponent} from '../../all/main-header/main-header.component';

@Component({
    selector: 'project-list',
  imports: [NgForOf, ProjectCardComponent, MainHeaderComponent],
    templateUrl: './project-list.component.html',
    standalone: true,
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    private projectService = inject(ProjectService);

    protected projects!: ProjectMetadata[];

    ngOnInit(): void {
        this.getProjects();
    }

    private getProjects() {
        this.projectService.getProjects().subscribe({
            next: res => {
                this.projects = res;
            }
        });
    }
}
