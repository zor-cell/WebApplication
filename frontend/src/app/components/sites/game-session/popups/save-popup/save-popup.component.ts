import {Component, input, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultState} from "../../../../../dto/sites/catan/result/ResultState";
import {ResultTeamState} from "../../../../../dto/sites/catan/result/ResultTeamState";

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
    saveTemplate = viewChild.required<TemplateRef<any>>('savePopup');
    saveForm!: FormGroup;

    public teams = input.required<Team[]>();
    protected imageUrl: string | null = null;
    private imageFile: File | null = null;


    saveSessionEvent = output<{ resultState: ResultState, imageFile: File | null }>();

    constructor(private popupService: PopupService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        const controls: any = {};

        for (let team of this.teams()) {
            controls[team.name] = [null, Validators.required];
        }

        this.saveForm = this.fb.group(controls);
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
        const teamState: ResultTeamState[] = this.teams().map(team => ({
            team: team,
            score: Number(this.saveForm.value[team.name])
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
