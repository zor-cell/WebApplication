import {Component, effect, inject, signal} from '@angular/core';
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {GameConfig} from "../../../../dto/sites/catan/game/GameConfig";
import {CatanService} from "../../../../services/sites/catan.service";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {Team} from "../../../../dto/all/Team";

@Component({
    selector: 'catan-game-settings',
    imports: [
        SliderCheckboxComponent,
        NgOptimizedImage,
        FormsModule,
        NgForOf,
        PlayerSelectComponent,
        GameSessionConfigComponent,
        GameSessionConfigComponent,
        ReactiveFormsModule
    ],
    templateUrl: './config.component.html',
    standalone: true,
    styleUrl: './config.component.css'
})
export class CatanConfigComponent {
    protected readonly projectName = "catan";

    private fb = inject(NonNullableFormBuilder);
    protected catanService = inject(CatanService);

    protected configForm = this.fb.group({
        teams: this.fb.control<Team[]>([]),
        gameMode: this.fb.control<GameMode>(GameMode.CITIES_AND_KNIGHTS),
        classicDice: this.fb.group({
            isBalanced: this.fb.control(true),
            shuffleThreshold: this.fb.control(5),
            useEvents: this.fb.control(false)
        }),
        eventDice: this.fb.group({
            isBalanced: this.fb.control(true),
            shuffleThreshold: this.fb.control(5),
            useEvents: this.fb.control(false)
        }),
        maxShipTurns: this.fb.control(7)
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
    }

    protected gameModes = Object.values(GameMode);
    protected readonly GameMode = GameMode;
    protected readonly getGameModeName = getGameModeName;
}
