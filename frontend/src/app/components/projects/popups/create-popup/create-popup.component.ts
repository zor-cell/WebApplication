import {Component, inject, output, TemplateRef, viewChild} from '@angular/core';
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {PopupService} from "../../../../services/popup.service";

@Component({
  selector: 'project-create-popup',
  imports: [],
  templateUrl: './create-popup.component.html',
  styleUrl: './create-popup.component.css'
})
export class ProjectCreatePopupComponent {
  private popupService = inject(PopupService);

  private createTemplate = viewChild.required<TemplateRef<any>>('createPopup');
  public createProjectEvent = output<void>();

  public openPopup() {
    this.popupService.createPopup(
        'Create Project',
        this.createTemplate(),
        this.callback.bind(this),
        undefined,
        'Create'
    );
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
      this.createProjectEvent.emit();
    }
  }
}
