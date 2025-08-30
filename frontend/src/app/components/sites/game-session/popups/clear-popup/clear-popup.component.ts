import {Component, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";

@Component({
    selector: 'game-session-clear-popup',
    imports: [],
    templateUrl: './clear-popup.component.html',
    standalone: true,
    styleUrl: './clear-popup.component.css'
})
export class GameSessionClearPopupComponent {
    clearTemplate = viewChild.required<TemplateRef<any>>('clearPopup');

    clearSessionEvent = output<void>();

    constructor(private popupService: PopupService) {
    }

    openPopup() {
        this.popupService.createPopup(
            'Clear Game Data',
            this.clearTemplate(),
            this.callback.bind(this),
            undefined,
            'Clear'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.clearSessionEvent.emit();
        }
    }
}
