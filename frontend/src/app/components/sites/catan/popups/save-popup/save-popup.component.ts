import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {CatanService} from "../../../../../services/sites/catan.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultState} from "../../../../../dto/sites/catan/result/ResultState";
import {ResultTeamState} from "../../../../../dto/sites/catan/result/ResultTeamState";

@Component({
    selector: 'catan-save-popup',
    imports: [
        NgForOf,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './save-popup.component.html',
    standalone: true,
    styleUrl: './save-popup.component.css'
})
export class CatanSavePopupComponent implements OnInit {
    @ViewChild('savePopup') saveTemplate!: TemplateRef<any>;
    saveForm!: FormGroup;

    @Input({required: true}) teams!: Team[];
    imageFile: File | null = null;
    imageUrl: string | null = null;

    constructor(private popupService: PopupService,
                private catanService: CatanService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        const controls: any = {};

        for (let team of this.teams) {
            controls[team.name] = [null, Validators.required];
        }

        this.saveForm = this.fb.group(controls);
    }

    openPopup() {
        this.popupService.createPopup(
            'Save Game Data',
            this.saveTemplate,
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

        this.imageFile = null;
        if(this.imageUrl) URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;
    }

    private saveGame() {
        const teamState: ResultTeamState[] = this.teams.map(team => ({
            team: team,
            score: Number(this.saveForm.value[team.name])
        }));

        const gameState: ResultState = {
            teams: teamState
        }

        this.catanService.saveSession(gameState, this.imageFile).subscribe({
            next: res => {
                this.saveForm.reset();
            }
        });
    }

    private createImageFromBlob(blob: Blob) {
        if(this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
        }

        this.imageUrl = URL.createObjectURL(blob);
    }
}
