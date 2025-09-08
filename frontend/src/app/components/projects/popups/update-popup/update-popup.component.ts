import {
    Component,
    EventEmitter, inject,
    input,
    Input,
    OnInit,
    output,
    Output,
    TemplateRef,
    viewChild,
    ViewChild
} from '@angular/core';
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {ProjectService} from "../../../../services/project.service";
import {ProjectDetails} from "../../../../dto/projects/ProjectDetails";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'project-update-popup',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './update-popup.component.html',
    standalone: true,
    styleUrl: './update-popup.component.css'
})
export class ProjectUpdatePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private projectService = inject(ProjectService);
    private fb = inject(FormBuilder);

    public updateTemplate = viewChild.required<TemplateRef<any>>('updatePopup');
    public project = input.required<ProjectDetails>();
    public canUpdate = input<boolean>(true);
    public updatedProjectEvent = output<boolean>();

    protected updateForm!: FormGroup;

    ngOnInit() {
        this.updateForm = this.fb.group({
            name: [this.project().metadata.name, Validators.required],
            createdAt: [this.project().metadata.createdAt, Validators.required],
            title: [this.project().metadata.title, Validators.required],
            description: [this.project().metadata.description, Validators.required],
            imagePath: [this.project().metadata.imagePath, Validators.required],
            githubUrl: [this.project().metadata.githubUrl],
            hasWebsite: [this.project().metadata.hasWebsite],
            isFavorite: [this.project().metadata.isFavorite],
            filePath: [this.project().filePath, Validators.required]
        });
    }

    public openPopup() {
        this.popupService.createPopup(
            'Update Project Data',
            this.updateTemplate(),
            this.callback.bind(this),
            () => true, //this.configsAreEqual(this.updateForm.value, this.project)
            'Update',
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateProject();
        }
    }

    private updateProject() {
        const formValue = this.updateForm.value;
        const project: ProjectDetails = {
            metadata: {
                name: formValue.name,
                createdAt: formValue.createdAt,
                title: formValue.title,
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
