import {Component, inject, OnInit, viewChild, ViewChild} from '@angular/core';
import {ProjectDetails} from "../../../dto/projects/ProjectDetails";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {NgIf} from "@angular/common";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {ProjectUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {AuthService} from "../../../services/all/auth.service";

@Component({
    selector: 'project-info',
    imports: [
        NgIf,
        RouterLink,
        MainHeaderComponent,
        ProjectUpdatePopupComponent
    ],
    templateUrl: './project-info.component.html',
    standalone: true,
    styleUrl: './project-info.component.css'
})
export class ProjectInfoComponent implements OnInit {
    protected authService = inject(AuthService);
    private projectService = inject(ProjectService);
    private route = inject(ActivatedRoute);

    public updatePopup = viewChild.required<ProjectUpdatePopupComponent>('updatePopup');

    protected project: ProjectDetails | null = null;
    private projectName: string | null = null;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.projectName = params.get('name');

            this.getProject();
        });
    }

    protected openUpdatePopup() {
        this.updatePopup().openPopup();
    }

    private getProject() {
        if (this.projectName == null) return;

        this.projectService.getProject(this.projectName).subscribe({
            next: res => {
                this.project = res;
            }
        });
    }
}
