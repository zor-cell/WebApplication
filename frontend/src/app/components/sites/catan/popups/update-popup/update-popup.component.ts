import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {PopupService} from "../../../../../services/popup.service";
import {CatanService} from "../../../../../services/sites/catan.service";
import {GameConfig} from "../../../../../dto/sites/catan/GameConfig";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";

@Component({
    selector: 'catan-update-popup',
    imports: [],
    templateUrl: './update-popup.component.html',
    standalone: true,
    styleUrl: './update-popup.component.css'
})
export class CatanUpdatePopupComponent {
    @ViewChild('updatePopup') updateTemplate!: TemplateRef<any>;
    @Input({required: true}) gameConfig!: GameConfig;
    @Input() canUpdate: boolean = true;

    @Output() updatedSessionEvent = new EventEmitter<boolean>();

    constructor(private popupService: PopupService,
                private catanService: CatanService) {
    }

    openPopup() {
        this.popupService.createPopup(
            'Update Game Data',
            this.updateTemplate,
            this.callback.bind(this),
            () => this.canUpdate,
            'Update',
            'Discard'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateSession();
        } else if (result === PopupResultType.DISCARD) {
            this.updatedSessionEvent.emit(false);
        }
    }

    private updateSession() {
        this.catanService.updateSession(this.gameConfig).subscribe({
            next: res => {
                this.updatedSessionEvent.emit(true);
            }
        });
    }
}
