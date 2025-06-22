import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {GameConfig} from "../../../../dto/catan/GameConfig";

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

  @Output() updatedSessionEvent = new EventEmitter<boolean>();

  constructor(private globals: Globals,
              private popupService: PopupService,
              private catanService: CatanService) {}

  openPopup() {
    this.popupService.createPopup(
        'Update Game Data',
        this.updateTemplate,
        this.callback.bind(this),
        undefined,
        'Update',
        'Discard'
    );
  }

  private callback(success: boolean) {
    if(success) {
      this.updateSession();
    }
  }

  private updateSession() {
    this.catanService.update(this.gameConfig).subscribe({
      next: res => {
        this.updatedSessionEvent.emit(true);
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }
}
