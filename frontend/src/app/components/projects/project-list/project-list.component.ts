import {Component, inject, OnInit, viewChild} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ProjectMetadata} from "../../../dto/projects/ProjectMetadata";
import {NgForOf, NgIf} from "@angular/common";
import {ProjectCardComponent} from "../project-card/project-card.component";
import {MainHeaderComponent} from '../../all/main-header/main-header.component';
import {AuthService} from "../../../services/all/auth.service";
import {ProjectUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {ProjectCreatePopupComponent} from "../popups/create-popup/create-popup.component";

@Component({
    selector: 'project-list',
    imports: [NgForOf, ProjectCardComponent, MainHeaderComponent, NgIf, ProjectUpdatePopupComponent],
    templateUrl: './project-list.component.html',
    standalone: true,
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    private projectService = inject(ProjectService);
    protected authService = inject(AuthService);

    private createPopup = viewChild.required<ProjectUpdatePopupComponent>('createPopup');

    protected projects!: ProjectMetadata[];

    ngOnInit(): void {
        this.getProjects();
    }

    protected openCreatePopup() {
        this.createPopup().openPopup();
    }

    protected createProject(): void {

    }

    private getProjects() {
        this.projectService.getProjects().subscribe({
            next: res => {
                this.projects = res;
            }
        });
    }
}
