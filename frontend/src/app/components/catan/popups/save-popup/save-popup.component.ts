import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../dto/global/Team";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {Globals} from "../../../../classes/globals";
import {PopupResultType} from "../../../../dto/global/PopupResultType";

@Component({
  selector: 'catan-save-popup',
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './save-popup.component.html',
  standalone: true,
  styleUrl: './save-popup.component.css'
})
export class CatanSavePopupComponent implements OnInit {
  @ViewChild('savePopup') saveTemplate!: TemplateRef<any>;
  saveForm!: FormGroup;

  @Input({required: true}) teams!: Team[];

  constructor(private globals: Globals,
              private popupService: PopupService,
              private catanService: CatanService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.saveForm = this.fb.group({
      winnerTeam: ['', [Validators.required]]
    });
  }

  openPopup() {
    this.popupService.createPopup(
        'Save Game Data',
        this.saveTemplate,
        this.callback.bind(this),
        () => this.saveForm.valid,
        'Save'
    );
  }

  private callback(result: PopupResultType) {
    if(result === PopupResultType.SUBMIT) {
      this.saveGame();
    } else if(result === PopupResultType.CANCEL) {
      this.saveForm.reset();
    }
  }

  private saveGame() {
    this.catanService.save(this.saveForm.value.winnerTeam).subscribe({
      next: res => {
        this.saveForm.reset();
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }
}
