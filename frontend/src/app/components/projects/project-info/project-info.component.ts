import {Component, OnInit} from '@angular/core';
import {ProjectDetails} from "../../../dto/projects/responses";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {Location, NgIf} from "@angular/common";
import {ProjectHeaderComponent} from "../project-header/project-header.component";

@Component({
  selector: 'app-project-info',
  imports: [
    NgIf,
    RouterLink,
    ProjectHeaderComponent
  ],
  templateUrl: './project-info.component.html',
  standalone: true,
  styleUrl: './project-info.component.css'
})
export class ProjectInfoComponent implements OnInit {
  projectName: string | null = null;
  project: ProjectDetails | null = null;

  constructor(private globals: Globals, private projectService: ProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectName = params.get('name');

      this.getProject();
    });
  }

  getProject() {
    if(this.projectName == null) return;

    this.projectService.getProject(this.projectName).subscribe({
      next: res => {
        this.project = res;
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }
}
