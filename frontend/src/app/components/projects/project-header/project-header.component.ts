import {Component, Input} from '@angular/core';
import {Location, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ProjectMetadata} from "../../../dto/projects/responses";
import {AuthService} from "../../../services/auth.service";

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
  @Input() showEdit: boolean = false;

  constructor(private location: Location,
              public authService: AuthService) {
    console.log(authService.user, authService.isAdmin())
  }

  routeBack() {
    this.location.back();
  }
}
