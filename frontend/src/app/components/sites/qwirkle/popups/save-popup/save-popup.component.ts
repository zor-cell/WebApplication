import {Component, inject, Input, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {CatanService} from "../../../../../services/sites/catan.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultTeamState} from "../../../../../dto/sites/catan/ResultTeamState";
import {ResultState} from "../../../../../dto/sites/catan/ResultState";
import {NgForOf, NgIf} from "@angular/common";
import {QwirkleService} from "../../../../../services/sites/qwirkle.service";

@Component({
  selector: 'qwirkle-save-popup',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './save-popup.component.html',
  standalone: true,
  styleUrl: './save-popup.component.css'
})
export class QwirkleSavePopupComponent {
  @ViewChild('savePopup') saveTemplate!: TemplateRef<any>;
  saveForm!: FormGroup;

  @Input({required: true}) teams!: Team[];
  imageFile: File | null = null;
  imageUrl: string | null = null;

  private popupService = inject(PopupService);
  private qwirkleService = inject(QwirkleService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    const controls: any = {};

    for (let team of this.teams) {
      controls[team.name] = [null, Validators.required];
    }

    this.saveForm = this.fb.group(controls);
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

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      this.imageFile = input.files![0];
      this.createImageFromBlob(this.imageFile);
    }
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
      this.saveGame();
    } else if (result === PopupResultType.CANCEL) {
      this.saveForm.reset();
    }

    this.imageFile = null;
    if(this.imageUrl) URL.revokeObjectURL(this.imageUrl);
    this.imageUrl = null;
  }

  private saveGame() {
    const teamState: ResultTeamState[] = this.teams.map(team => ({
      team: team,
      score: Number(this.saveForm.value[team.name])
    }));

    const resultState: ResultState = {
      teams: teamState
    }

    this.qwirkleService.saveSession(resultState, this.imageFile).subscribe({
      next: res => {
        this.saveForm.reset();
      }
    });
  }

  private createImageFromBlob(blob: Blob) {
    if(this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    this.imageUrl = URL.createObjectURL(blob);
  }
}
