import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  @Output() editEvent = new EventEmitter<void>();

  constructor(private location: Location,
              public authService: AuthService) {}

  routeBack() {
    this.location.back();
  }
}
