import {Component, effect, inject, input, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultState} from "../../../../../dto/sites/catan/result/ResultState";
import {ResultTeamState} from "../../../../../dto/sites/catan/result/ResultTeamState";

interface SaveForm {
    score: FormControl<number | null>;
}

@Component({
    selector: 'game-session-save-popup',
    imports: [
        NgForOf,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './save-popup.component.html',
    standalone: true,
    styleUrl: './save-popup.component.css'
})
export class GameSessionSavePopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private fb = inject(FormBuilder);

    saveTemplate = viewChild.required<TemplateRef<any>>('savePopup');
    saveForm!: FormGroup<Record<string, FormGroup<SaveForm>>>;

    public teams = input.required<Team[]>();
    public scores = input<Record<string, number>>();
    public showFileUpload = input<boolean>(true);
    public saveSessionEvent = output<{ resultState: ResultState, imageFile: File | null }>();

    protected imageUrl: string | null = null;
    private imageFile: File | null = null;

    constructor() {
        effect(() => {
            if (this.scores()) {
                for (let team of this.teams()) {
                    this.saveForm.controls[team.name].controls.score.setValue(this.scores()![team.name], {emitEvent: false});
                }
            }
        });
    };

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
        this.popupService.createPopup(
            'Save Game Data',
            this.saveTemplate(),
            this.callback.bind(this),
            () => this.saveForm.valid,
            'Save'
        );
    }

    onFileChanged(event: Event) {
        const input = event.target as HTMLInputElement;
        if(!input.files?.length) return;

        if(input.files) {
            this.imageFile = input.files![0];
            this.createImageFromBlob(this.imageFile);
        }
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.saveGame();
        } else if (result === PopupResultType.CANCEL) {
            this.saveForm.reset();
        }
        this.saveForm.reset();

        this.imageFile = null;
        if(this.imageUrl) URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;
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

        this.saveSessionEvent.emit({resultState: resultState, imageFile: this.imageFile});
    }

    private createImageFromBlob(blob: Blob) {
        if(this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
        }

        this.imageUrl = URL.createObjectURL(blob);
    }
}
