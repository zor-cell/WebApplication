import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {GameConfig} from "../../../../dto/catan/GameConfig";
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {PopupResultType} from "../../../../dto/global/PopupResultType";
import {ProjectService} from "../../../../services/project.service";
import {ProjectDetails} from "../../../../dto/projects/responses";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-update-popup',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './update-popup.component.html',
  standalone: true,
  styleUrl: './update-popup.component.css'
})
export class UpdatePopupComponent implements OnInit {
  @ViewChild('updatePopup') updateTemplate!: TemplateRef<any>;
  updateForm!: FormGroup;

  @Input({required: true}) project!: ProjectDetails;
  @Input() canUpdate: boolean = true;

  @Output() updatedProjectEvent = new EventEmitter<boolean>();

  constructor(private globals: Globals,
              private popupService: PopupService,
              private projectService: ProjectService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [this.project.metadata.name, Validators.required],
      createdAt: [this.project.metadata.createdAt, Validators.required],
      description: [this.project.metadata.description, Validators.required],
      imagePath: [this.project.metadata.imagePath, Validators.required],
      githubUrl: [this.project.metadata.githubUrl],
      hasWebsite: [this.project.metadata.hasWebsite],
      isFavorite: [this.project.metadata.isFavorite],
      filePath: [this.project.filePath, Validators.required]
    });
  }

  openPopup() {
    this.popupService.createPopup(
        'Update Project Data',
        this.updateTemplate,
        this.callback.bind(this),
        () => true, //this.configsAreEqual(this.updateForm.value, this.project)
        'Update',
    );
  }

  private callback(result: PopupResultType) {
    if(result === PopupResultType.SUBMIT) {
      this.updateProject();
    }
  }

  private updateProject() {
    const formValue = this.updateForm.value;
    const project: ProjectDetails = {
      metadata: {
        name: formValue.name,
        createdAt: formValue.createdAt,
        description: formValue.description,
        imagePath: formValue.imagePath,
        githubUrl: formValue.githubUrl,
        hasWebsite: formValue.hasWebsite,
        isFavorite: formValue.isFavorite
      },
      content: '',
      filePath: formValue.filePath
    };

    this.projectService.updateProject(project).subscribe({
      next: res => {
        this.updatedProjectEvent.emit(true);
      }
    });
  }

  private configsAreEqual(config1: ProjectDetails, config2: ProjectDetails): boolean {
    return JSON.stringify(config1) === JSON.stringify(config2);
  }
}
