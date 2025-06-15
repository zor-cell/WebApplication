import {Component, ContentChild, Inject, Input, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf, NgTemplateOutlet} from "@angular/common";


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
export class PopupDialogComponent implements OnInit {
  @Input() title: string = 'Modal';
  @Input() cancelText: string = 'Cancel';
  @Input() submitText: string = 'Submit';

  @Input({required: true}) bodyTemplate!: TemplateRef<any>;
  @Input() submitValidator: (() => boolean) | null = null;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {}

  ngOnInit() {

  }

  get valid() {
    if(this.submitValidator === null) return true;

    return this.submitValidator();
  }

  submit() {
    if(this.valid) {
      this.activeModal.close('submit');
    }
  }
}
