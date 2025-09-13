import {Component, inject, input, OnInit, output, signal, TemplateRef, viewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultState} from "../../../../../dto/sites/catan/result/ResultState";
import {ResultTeamState} from "../../../../../dto/sites/catan/result/ResultTeamState";
import {FileUpload} from "../../../../../dto/all/FileUpload";
import {FileUploadComponent} from "../../../../all/file-upload/file-upload.component";

interface SaveForm {
    score: FormControl<number | null>;
}

type SaveForm2 = {

}

type TeamForm =  {
    score: FormControl<number | null>;
};

@Component({
    selector: 'game-session-save-popup',
    imports: [
        NgForOf,
        ReactiveFormsModule,
        NgIf,
        FileUploadComponent
    ],
    templateUrl: './save-popup.component.html',
    standalone: true,
    styleUrl: './save-popup.component.css'
})
export class GameSessionSavePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private fb = inject(FormBuilder);

    private saveTemplate = viewChild.required<TemplateRef<any>>('savePopup');
    public teams = input.required<Team[]>();
    public scores = input<Record<string, number>>();
    public showFileUpload = input<boolean>(true);
    public saveSessionEvent = output<{ resultState: ResultState, imageFile: File | null }>();

    protected saveForm!: FormGroup<Record<string, FormGroup<SaveForm>>>;
    protected fileUpload = signal<FileUpload>({
        file: null,
        fileUrl: null
    });

    ngOnInit() {
        const group: Record<string, FormGroup<SaveForm>> = {};

        for(let team of this.teams()) {
            group[team.name] = this.fb.group({
               score: this.fb.control<number | null>(null, {validators: Validators.required})
            });
        }

        this.saveForm = this.fb.group(group);
    }

    openPopup() {
        //populate with scores if there are any
        if (this.scores()) {
            for (let team of this.teams()) {
                this.saveForm.controls[team.name].controls.score.setValue(this.scores()![team.name], {emitEvent: false});
            }
        }

        this.popupService.createPopup(
            'Save Game Data',
            this.saveTemplate(),
            this.callback.bind(this),
            () => this.saveForm.valid,
            'Save'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.saveGame();
        } else if (result === PopupResultType.CANCEL) {
            this.saveForm.reset();
        }
        this.saveForm.reset();

        //TODO: how to reset file url
        /*this.imageFile = null;
        if(this.imageUrl) URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;*/
    }

    private saveGame() {
        const formValue = this.saveForm.getRawValue();

        const teamState: ResultTeamState[] = this.teams().map(team => ({
            team: team,
            score: Number(formValue[team.name].score)
        }));

        const resultState: ResultState = {
            teams: teamState
        }

        this.saveSessionEvent.emit({resultState: resultState, imageFile: this.fileUpload().file});
    }
}
