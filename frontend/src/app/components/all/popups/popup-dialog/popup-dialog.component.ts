import {Component, inject, TemplateRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {PopupResultType} from "../../../../dto/all/PopupResultType";


@Component({
    selector: 'app-popup-dialog',
    imports: [
        ReactiveFormsModule,
        NgTemplateOutlet,
        NgIf
    ],
    templateUrl: './popup-dialog.component.html',
    standalone: true,
    styleUrl: './popup-dialog.component.css'
})
export class PopupDialogComponent {
    private activeModal = inject(NgbActiveModal);

    public bodyTemplate!: TemplateRef<any>;
    public submitValidator: (() => boolean) | null = null;
    public title: string = 'Modal';
    public cancelText: string = 'Cancel';
    public submitText: string = 'Submit';
    public discardText: string | null = null;

    protected get valid(): boolean {
        if (this.submitValidator === null) return true;

        return this.submitValidator();
    }

    protected cancel() {
        this.activeModal.dismiss(PopupResultType.CANCEL)
    }

    protected discard() {
        this.activeModal.close(PopupResultType.DISCARD);
    }

    protected submit() {
        if (this.valid) {
            this.activeModal.close(PopupResultType.SUBMIT);
        }
    }
}
