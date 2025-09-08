import {Component, inject, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PopupService} from "../../../../services/popup.service";
import {PlayerDetails} from "../../../../dto/all/PlayerDetails";
import {PlayerService} from "../../../../services/player.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {PlayerCreate} from "../../../../dto/all/PlayerCreate";

@Component({
    selector: 'app-new-player-popup',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './new-player-popup.component.html',
    standalone: true,
    styleUrl: './new-player-popup.component.css'
})
export class NewPlayerPopupComponent implements OnInit {
    private popupService = inject(PopupService);
    private playerService = inject(PlayerService);
    private fb = inject(FormBuilder);

    public playerTemplate = viewChild.required<TemplateRef<any>>('playerPopup');
    public newPlayerEvent = output<PlayerDetails>();

    protected playerForm!: FormGroup;

    ngOnInit() {
        this.playerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    public openPopup() {
        this.popupService.createPopup(
            'Create New Player',
            this.playerTemplate(),
            this.callback.bind(this),
            () => this.playerForm.valid,
            'Create');
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.savePlayer();
        } else if (result === PopupResultType.CANCEL) {
            this.playerForm.reset();
        }
    }

    private savePlayer() {
        const player: PlayerCreate = {
            name: this.playerForm.value.name
        };

        this.playerService.savePlayer(player).subscribe({
            next: res => {
                this.newPlayerEvent.emit(res);
                this.playerForm.reset();
            }
        })
    }
}
