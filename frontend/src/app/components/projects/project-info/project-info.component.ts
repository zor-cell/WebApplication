import {Component, Input, OnInit} from '@angular/core';
import {ProjectDetails} from "../../../dto/projects/responses";
import {ActivatedRoute} from "@angular/router";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-project-info',
  imports: [
    NgIf
  ],
  templateUrl: './project-info.component.html',
  standalone: true,
  styleUrl: './project-info.component.css'
})
export class ProjectInfoComponent implements OnInit {
  projectName: string | null = null;
  projectDetails: ProjectDetails | null = null;

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
        this.projectDetails = res;
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }
}
