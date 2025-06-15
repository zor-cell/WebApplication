import {Injectable, TemplateRef} from '@angular/core';
import {PopupDialogComponent} from "../components/global/popup/popup-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private modalService: NgbModal) { }

  createPopup(title: string,
              bodyTemplate: TemplateRef<any>,
              callback: (success: boolean) => void,
              submitValidator?: () => boolean,
              submitText?: string,
              cancelText?: string) {
    const modalRef = this.modalService.open(PopupDialogComponent);

    //set popup inputs
    modalRef.componentInstance.title = title;
    if(cancelText) modalRef.componentInstance.cancelText = cancelText;
    if(submitText) modalRef.componentInstance.submitText = submitText;

    if(submitValidator) modalRef.componentInstance.submitValidator = submitValidator;
    modalRef.componentInstance.bodyTemplate = bodyTemplate;

    modalRef.result.then(
        () => {
          callback(true);
        },
        () => {
            callback(false);
        }
    );
  }
}
