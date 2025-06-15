import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";

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

  constructor(private globals: Globals,
              private popupService: PopupService,
              private catanService: CatanService,
              private fb: FormBuilder) {}

  openPopup() {
    this.popupService.createPopup(
        'Clear Game Data',
        this.clearTemplate,
        this.callback.bind(this),
        undefined,
        'Clear'
    );
  }

  private callback(success: boolean) {
    if(success) {
      this.clearSession();
    }
  }

  private clearSession() {
    this.catanService.clear().subscribe({
      next: res => {
        this.hasSessionEvent.emit(false);
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }
}
