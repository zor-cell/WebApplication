import {Component, signal, viewChild} from '@angular/core';
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../../dto/sites/catan/game/GameConfig";
import {CatanService} from "../../../../services/sites/catan.service";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {Router} from "@angular/router";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";
import {GameSessionComponent} from "../../game-session/game-session.component";

@Component({
    selector: 'catan-game-settings',
    imports: [
        SliderCheckboxComponent,
        NgOptimizedImage,
        FormsModule,
        NgForOf,
        PlayerSelectComponent,
        GameSessionComponent,
        GameSessionComponent
    ],
    templateUrl: './config.component.html',
    standalone: true,
    styleUrl: './config.component.css'
})
export class CatanConfigComponent {
    private baseComponent = viewChild.required<GameSessionComponent<GameConfig>>('base');
    gameConfig = signal<GameConfig>({
        teams: [],
        gameMode: GameMode.CITIES_AND_KNIGHTS,
        classicDice: {
            isBalanced: true,
            shuffleThreshold: 5,
            useEvents: false
        },
        eventDice: {
            isBalanced: false,
            shuffleThreshold: 2,
            useEvents: false
        },
        maxShipTurns: 7
    });
    gameModes = Object.values(GameMode);

    constructor(protected catanService: CatanService) {
    }

    isValidConfig() {
        if (this.gameConfig().gameMode === GameMode.ONE_VS_ONE) {
            return this.gameConfig().teams.length == 2;
        }

        return this.gameConfig().teams.length >= 2;
    }

    protected readonly GameMode = GameMode;
    protected readonly getGameModeName = getGameModeName;
}
