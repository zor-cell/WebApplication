import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {PopupResultType} from "../../../../dto/global/PopupResultType";

@Component({
    selector: 'catan-clear-popup',
    imports: [],
    templateUrl: './clear-popup.component.html',
    standalone: true,
    styleUrl: './clear-popup.component.css'
})
export class CatanClearPopupComponent {
    @ViewChild('clearPopup') clearTemplate!: TemplateRef<any>;

    @Output() hasSessionEvent = new EventEmitter<boolean>();

    constructor(private popupService: PopupService,
                private catanService: CatanService) {
    }

    openPopup() {
        this.popupService.createPopup(
            'Clear Game Data',
            this.clearTemplate,
            this.callback.bind(this),
            undefined,
            'Clear'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.clearSession();
        }
    }

    private clearSession() {
        this.catanService.clear().subscribe({
            next: res => {
                this.hasSessionEvent.emit(false);
            }
        });
    }
}
