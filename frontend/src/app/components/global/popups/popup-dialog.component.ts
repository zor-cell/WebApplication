import {Component, Input, TemplateRef} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {PopupResultType} from "../../../dto/global/PopupResultType";


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
  @Input() title: string = 'Modal';
  @Input() cancelText: string = 'Cancel';
  @Input() submitText: string = 'Submit';
  @Input() discardText: string | null = null;

  @Input({required: true}) bodyTemplate!: TemplateRef<any>;
  @Input() submitValidator: (() => boolean) | null = null;

  constructor(private activeModal: NgbActiveModal) {}

  get valid() {
    if(this.submitValidator === null) return true;

    return this.submitValidator();
  }

  cancel() {
    this.activeModal.dismiss(PopupResultType.CANCEL)
  }

  discard() {
    this.activeModal.close(PopupResultType.DISCARD);
  }

  submit() {
    if(this.valid) {
      this.activeModal.close(PopupResultType.SUBMIT);
    }
  }
}
