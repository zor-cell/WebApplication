import {Component, OnInit, ViewChild} from '@angular/core';
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
    @ViewChild('updatePopup') updatePopup!: ProjectUpdatePopupComponent;

    projectName: string | null = null;
    project: ProjectDetails | null = null;

    constructor(private globals: Globals,
                public authService: AuthService,
                private projectService: ProjectService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.projectName = params.get('name');

            this.getProject();
        });
    }

    getProject() {
        if (this.projectName == null) return;

        this.projectService.getProject(this.projectName).subscribe({
            next: res => {
                this.project = res;
            }
        });
    }

    openUpdatePopup() {
        this.updatePopup.openPopup();
    }
}
