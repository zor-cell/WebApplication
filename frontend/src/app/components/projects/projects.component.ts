import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {Globals} from "../../classes/globals";

@Component({
    selector: 'app-projects',
    imports: [RouterLink],
    templateUrl: './projects.component.html',
    standalone: true,
    styleUrl: './projects.component.css'
})
export class ProjectsComponent {
    constructor(private globals: Globals, private projectService: ProjectService) {}

    htmlString: string = "";
    html() {
        this.projectService.html("connect4").subscribe({
            next: res => {
                this.htmlString = res.content;
            },
            error: err => {
                this.globals.handleError(err);
            }
        })
    }
}
