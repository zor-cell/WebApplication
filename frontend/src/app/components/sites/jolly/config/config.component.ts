import {Component, inject, signal} from '@angular/core';
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameConfig} from "../../../../dto/sites/jolly/game/GameConfig";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule, Validators
} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {Team} from "../../../../dto/all/Team";

@Component({
  selector: 'jolly-game-config',
  imports: [
    GameSessionConfigComponent,
    FormsModule,
    PlayerSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  standalone: true,
  styleUrl: './config.component.css'
})
export class JollyConfigComponent {
  protected readonly projectName = "jolly";

  private fb = inject(NonNullableFormBuilder);
  protected jollyService = inject(JollyService);

  protected configForm = this.fb.group({
    teams: this.fb.control<Team[]>([], [Validators.minLength(2)]),
    roundLimit: this.fb.control(0),
    noRoundLimit: this.fb.control(true)
  });
}
