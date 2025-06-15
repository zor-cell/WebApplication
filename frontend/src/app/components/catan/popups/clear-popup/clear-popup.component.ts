import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Team} from "../../../../dto/global/Team";
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'catan-clear-popup',
  imports: [],
  templateUrl: './clear-popup.component.html',
  standalone: true,
  styleUrl: './clear-popup.component.css'
})
export class ClearPopupComponent {
  @ViewChild('clearPopup') clearTemplate!: TemplateRef<any>;

  @Output() hasSessionEvent = new EventEmitter<boolean>();

  constructor(private globals: Globals,
              private popupService: PopupService,
              private catanService: CatanService,
              private fb: FormBuilder) {}

  openClearPopup() {
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
