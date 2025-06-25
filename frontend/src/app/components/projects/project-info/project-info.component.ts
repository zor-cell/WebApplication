import {Component, OnInit, ViewChild} from '@angular/core';
import {ProjectDetails} from "../../../dto/projects/responses";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {NgIf} from "@angular/common";
import {ProjectHeaderComponent} from "../project-header/project-header.component";
import {CatanUpdatePopupComponent} from "../../catan/popups/update-popup/update-popup.component";
import {UpdatePopupComponent} from "../popups/update-popup/update-popup.component";

@Component({
  selector: 'app-project-info',
  imports: [
    NgIf,
    RouterLink,
    ProjectHeaderComponent,
    CatanUpdatePopupComponent,
    UpdatePopupComponent
  ],
  templateUrl: './project-info.component.html',
  standalone: true,
  styleUrl: './project-info.component.css'
})
export class ProjectInfoComponent implements OnInit {
  @ViewChild('updatePopup') updatePopup!: UpdatePopupComponent;

  projectName: string | null = null;
  project: ProjectDetails | null = null;

  constructor(private globals: Globals, private projectService: ProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectName = params.get('name');

      this.globals.handleError("test");

      this.getProject();
    });
  }

  getProject() {
    if(this.projectName == null) return;

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
