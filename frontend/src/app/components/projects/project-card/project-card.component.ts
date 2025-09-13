import {Component, input} from '@angular/core';
import {ProjectMetadata} from "../../../dto/projects/ProjectMetadata";
import {DatePipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'project-card',
    imports: [
        NgIf,
        RouterLink,
        DatePipe
    ],
    templateUrl: './project-card.component.html',
    standalone: true,
    styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
    public project = input.required<ProjectMetadata>();
}
