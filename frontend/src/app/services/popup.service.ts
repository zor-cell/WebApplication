import {Injectable, TemplateRef} from '@angular/core';
import {PopupDialogComponent} from "../components/global/popups/popup-dialog.component";
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
              discardText?: string,
              cancelText?: string) {
    const modalRef = this.modalService.open(PopupDialogComponent);

    //set popup inputs
    modalRef.componentInstance.title = title;

    if(submitText) modalRef.componentInstance.submitText = submitText;
    if(discardText) modalRef.componentInstance.discardText = discardText;
    if(cancelText) modalRef.componentInstance.cancelText = cancelText;

    if(submitValidator) modalRef.componentInstance.submitValidator = submitValidator;
    modalRef.componentInstance.bodyTemplate = bodyTemplate;

    modalRef.result.then(
        (res) => {
            console.log(res);
          callback(true);
        },
        () => {
            callback(false);
        }
    );
  }
}
