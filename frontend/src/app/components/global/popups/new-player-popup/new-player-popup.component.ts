import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from "../../../../dto/global/Team";
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {CatanService} from "../../../../services/catan.service";
import {PlayerDetails} from "../../../../dto/global/PlayerDetails";
import {PlayerService} from "../../../../services/player.service";

@Component({
  selector: 'app-new-player-popup',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-player-popup.component.html',
  standalone: true,
  styleUrl: './new-player-popup.component.css'
})
export class NewPlayerPopupComponent {
  @ViewChild('playerPopup') playerTemplate!: TemplateRef<any>;
  playerForm!: FormGroup;

  @Output() newPlayerEvent = new EventEmitter<PlayerDetails>();

  constructor(private globals: Globals,
              private popupService: PopupService,
              private playerService: PlayerService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  openPopup() {
    this.popupService.createPopup(
        'Create New Player',
        this.playerTemplate,
        this.callback.bind(this),
        () => this.playerForm.valid,
        'Create');
  }

  private callback(success: boolean) {
    if(success) {
     this.savePlayer();
    } else {
      this.playerForm.reset();
    }
  }

  private savePlayer() {
    const player: PlayerDetails = {
      name: this.playerForm.value.name
    };

    this.playerService.savePlayer(player).subscribe({
      next: res => {
        this.newPlayerEvent.emit(res);
        this.playerForm.reset();
      },
      error: err => {
        this.globals.handleError(err);
      }
    })
  }
}
