import {Component, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../services/popup.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {ProjectService} from "../../../../services/project.service";
import {ProjectDetails} from "../../../../dto/projects/ProjectDetails";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgIf} from "@angular/common";
import {FileUpload} from "../../../../dto/all/FileUpload";
import {FileUploadComponent} from "../../../all/file-upload/file-upload.component";
import {WithFile} from "../../../../dto/all/WithFile";

type ProjectForm = FormGroup<{
    name: FormControl<string>;
    createdAt: FormControl<Date>;
    title: FormControl<string>;
    description: FormControl<string>;
    imagePath: FormControl<string | null>;
    githubUrl: FormControl<string | null>;
    hasWebsite: FormControl<boolean>;
    isFavorite: FormControl<boolean>;
    filePath: FormControl<string>;
}>;

@Component({
    selector: 'project-update-popup',
    imports: [
        ReactiveFormsModule,
        DatePipe,
        FileUploadComponent,
        NgIf
    ],
    templateUrl: './update-popup.component.html',
    standalone: true,
    styleUrl: './update-popup.component.css'
})
export class ProjectUpdatePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private fb = inject(FormBuilder);

    private updateTemplate = viewChild.required<TemplateRef<any>>('updatePopup');
    public project = input<ProjectDetails | null>(null);
    public updateProjectEvent = output<WithFile<ProjectDetails>>();

    protected readonly filePathPrefix = 'projects/';
    protected readonly imagePathPrefix = 'projects/';
    protected fileUpload = signal<FileUpload>({
        file: null,
        fileUrl: null
    });
    protected projectForm: ProjectForm = this.fb.group({
        name: this.fb.nonNullable.control('', {validators: Validators.required}),
        createdAt: this.fb.nonNullable.control(new Date(), {validators: Validators.required}),
        title: this.fb.nonNullable.control('', {validators: Validators.required}),
        description: this.fb.nonNullable.control('', {validators: Validators.required}),
        imagePath: this.fb.control<string | null>(null),
        githubUrl: this.fb.control<string | null>(null),
        hasWebsite: this.fb.nonNullable.control(false, {validators: Validators.required}),
        isFavorite: this.fb.nonNullable.control(false, {validators: Validators.required}),
        filePath: this.fb.nonNullable.control('', {validators: Validators.required}),
    });

    ngOnInit() {
        const project = this.project();
        if (project != null) {
            const filePath = project.filePath.startsWith(this.filePathPrefix) ? project.filePath.substring(this.filePathPrefix.length) : project.filePath;

            const url = project.metadata.imagePath;
            let imagePath = null;
            if(url && url.length > 0) {
                if(url.includes("static")) {
                    imagePath = null;
                } else {
                    imagePath = url.includes(this.imagePathPrefix) ? url.substring(url.indexOf(this.imagePathPrefix) + this.imagePathPrefix.length) : url;
                }
            }

            this.projectForm.patchValue({
                name: project.metadata.name,
                createdAt: project.metadata.createdAt,
                title: project.metadata.title,
                description: project.metadata.description,
                imagePath: imagePath,
                githubUrl: project.metadata.githubUrl,
                hasWebsite: project.metadata.hasWebsite,
                isFavorite: project.metadata.isFavorite,
                filePath: filePath
            });
        }

        this.projectForm.controls.createdAt.disable();
    }

    public openPopup() {
        const isUpdate = this.project() != null;

        this.popupService.createPopup(
            isUpdate ? 'Update Project' : 'Create Project',
            this.updateTemplate(),
            this.callback.bind(this),
            () => this.projectForm.valid, //this.configsAreEqual(this.updateForm.value, this.project)
            isUpdate ? 'Update' : 'Create',
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateProject();
        }
        this.projectForm.reset();
    }

    private formToDetails() {
        const value = this.projectForm.getRawValue();
        const project: ProjectDetails = {
            metadata: {
                name: value.name,
                createdAt: value.createdAt,
                title: value.title,
                description: value.description,
                imagePath: value.imagePath ? this.imagePathPrefix + value.imagePath : value.imagePath,
                githubUrl: value.githubUrl,
                hasWebsite: value.hasWebsite,
                isFavorite: value.isFavorite
            },
            content: '',
            filePath: this.filePathPrefix + value.filePath
        };

        return project;
    }

    private updateProject() {
        const project = this.formToDetails();
        this.updateProjectEvent.emit({
            data: project,
            file: this.fileUpload().file
        });
    }

    //TODO check if no changes were applied for validity
    private configsAreEqual(config1: ProjectDetails, config2: ProjectDetails): boolean {
        return JSON.stringify(config1) === JSON.stringify(config2);
    }
}
