import {Component, output, TemplateRef, viewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PopupService} from "../../../services/popup.service";
import {PopupResultType} from "../../../dto/all/PopupResultType";

@Component({
  selector: 'game-delete-popup',
    imports: [
        FormsModule,
    ],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css'
})
export class DeletePopupComponent {
    deletePopup = viewChild.required<TemplateRef<any>>('deletePopup');

    deleteGameEvent = output<void>();

    constructor(private popupService: PopupService) {
    }

    openPopup() {
        this.popupService.createPopup(
            'Delete Game',
            this.deletePopup(),
            this.callback.bind(this),
            undefined,
            'Delete'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.deleteGameEvent.emit();
        }
    }
}
