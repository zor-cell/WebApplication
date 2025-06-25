import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../dto/global/Team";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {PopupResultType} from "../../../../dto/global/PopupResultType";
import {SaveGameState} from "../../../../dto/catan/SaveGameState";
import {SaveTeamState} from "../../../../dto/catan/SaveTeamState";

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

  constructor(private popupService: PopupService,
              private catanService: CatanService,
              private fb: FormBuilder) {}

  ngOnInit() {
    const controls: any = {};

    for(let team of this.teams) {
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

  private callback(result: PopupResultType) {
    if(result === PopupResultType.SUBMIT) {
      this.saveGame();
    } else if(result === PopupResultType.CANCEL) {
      this.saveForm.reset();
    }
  }

  private saveGame() {
    const teamState: SaveTeamState[] = this.teams.map(team => ({
      team: team,
      score: this.saveForm.value[team.name]
    }));

    const gameState: SaveGameState = {
      teams: teamState
    }

    this.catanService.save(gameState).subscribe({
      next: res => {
        this.saveForm.reset();
      }
    });
  }
}
