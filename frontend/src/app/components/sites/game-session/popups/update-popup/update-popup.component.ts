import {Component, input, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";

@Component({
    selector: 'game-session-update-popup',
    imports: [],
    templateUrl: './update-popup.component.html',
    standalone: true,
    styleUrl: './update-popup.component.css'
})
export class GameSessionUpdatePopupComponent {
    updateTemplate = viewChild.required<TemplateRef<any>>('updatePopup');
    canUpdate = input<boolean>(false);

    updateSessionEvent = output<boolean>();

    constructor(private popupService: PopupService) {}

    openPopup() {
        this.popupService.createPopup(
            'Update Game Data',
            this.updateTemplate(),
            this.callback.bind(this),
            () => this.canUpdate(),
            'Update',
            'Discard'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateSessionEvent.emit(true);
        } else if(result == PopupResultType.DISCARD) {
            this.updateSessionEvent.emit(false);
        }
    }
}
