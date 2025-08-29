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
  ReactiveFormsModule
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
  protected gameConfig = signal<GameConfig>({
    teams: [],
    roundLimit: 0,
    noRoundLimit: true
  });

  private fb = inject(NonNullableFormBuilder);
  protected jollyService = inject(JollyService);

  protected configForm = this.fb.group({
    teams: this.fb.array<FormGroup<{
      name: FormControl<string>,
      players: FormArray<FormGroup<{
        id: FormControl<string>,
        name: FormControl<string>,
      }>>
    }>>([]),
    roundLimit: this.fb.control(0),
    noRoundLimit: this.fb.control(true),
  })

  protected readonly projectName = "catan";

  isValidConfig() {

    return this.gameConfig().teams.length >= 2;
  }

  teamsSelection(event: any) {
    console.log(event);
  }

  test() {
    console.log(this.configForm.value);
  }
}
