import {Component, effect, inject, signal} from '@angular/core';
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {GameConfig} from "../../../../dto/sites/qwirkle/game/GameConfig";
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {Team} from "../../../../dto/all/Team";

@Component({
    selector: 'qwirkle-game-config',
    imports: [
        GameSessionConfigComponent,
        FormsModule,
        NgForOf,
        PlayerSelectComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './config.component.html',
    standalone: true,
    styleUrl: './config.component.css'
})
export class QwirkleConfigComponent {
    protected readonly projectName = "qwirkle";

    private fb = inject(NonNullableFormBuilder);
    protected qwirkleService = inject(QwirkleService);

    protected configForm = this.fb.group({
        teams: this.fb.control<Team[]>([]),
        playingTeam: this.fb.control({value: -1, disabled: true})
    });

    protected gameConfig = signal(this.configForm.getRawValue() as GameConfig);

    constructor() {
        //set signal when form changes
        this.configForm.valueChanges.subscribe(() => {
            this.gameConfig.set(this.configForm.getRawValue() as GameConfig);
        });

        //update form when signal changes
        effect(() => {
            this.configForm.patchValue(this.gameConfig(), {emitEvent: false});
        });

        //listen for team changes
        this.configForm.controls.teams.valueChanges.subscribe(teams => {
            const playingControl = this.configForm.controls.playingTeam;
            if (teams.length === 0) {
                playingControl.disable();
                playingControl.setValue(-1);
            } else {
                playingControl.enable();

                // If current value is invalid (-1 or out of bounds), reset to 0
                if (playingControl.value < 0 || playingControl.value >= teams.length) {
                    playingControl.setValue(0);
                }
            }
        });
    }
}
