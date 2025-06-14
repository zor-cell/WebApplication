import {Component, Input} from '@angular/core';
import {Location, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {ProjectMetadata} from "../../../dto/projects/responses";

@Component({
  selector: 'app-project-header',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './project-header.component.html',
  standalone: true,
  styleUrl: './project-header.component.css'
})
export class ProjectHeaderComponent {
  @Input() project: ProjectMetadata| undefined = undefined;
  @Input() showWebsite: boolean = false;

  constructor(private location: Location) {}

  routeBack() {
    this.location.back();
  }
}
