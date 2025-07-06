import {Component, Input, TemplateRef} from '@angular/core';
import {Location, NgIf, NgTemplateOutlet} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ProjectMetadata} from "../../../dto/projects/responses";

@Component({
    selector: 'app-project-header',
    imports: [
        NgIf,
        RouterLink,
        NgTemplateOutlet
    ],
    templateUrl: './main-header.component.html',
    standalone: true,
    styleUrl: './main-header.component.css'
})
export class MainHeaderComponent {
    @Input() project: ProjectMetadata | null = null;
    @Input() showWebsite: boolean = false;

    @Input() customTemplate!: TemplateRef<any>;

    constructor(private location: Location) {
    }

    routeBack() {
        this.location.back();
    }
}
