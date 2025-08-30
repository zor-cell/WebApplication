import {Component, inject, OnInit, signal} from '@angular/core';
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {GameConfig} from "../../../../dto/sites/qwirkle/game/GameConfig";
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";
import {Team} from "../../../../dto/all/Team";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

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
        playingTeam: this.fb.control(-1)
    });

    protected gameConfig1 = toSignal(
        this.configForm.valueChanges.pipe(
            map(() => this.configForm.getRawValue() as GameConfig)
        ), {
            initialValue: this.configForm.getRawValue() as GameConfig
        });

    updatePlayingTeam(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.options[selectElement.selectedIndex].value;

        this.gameConfig1().playingTeam = parseInt(selectedValue);
    }

    protected readonly getGameModeName = getGameModeName;
    protected readonly GameMode = GameMode;
}
