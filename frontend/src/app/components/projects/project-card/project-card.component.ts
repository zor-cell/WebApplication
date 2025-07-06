import {Component, Input} from '@angular/core';
import {ProjectMetadata} from "../../../dto/projects/responses";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'project-card',
    imports: [
        NgIf,
        RouterLink
    ],
    templateUrl: './project-card.component.html',
    standalone: true,
    styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
    @Input({required: true}) project!: ProjectMetadata;
}
