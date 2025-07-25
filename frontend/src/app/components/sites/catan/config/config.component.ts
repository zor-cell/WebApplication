import {Component, OnInit, ViewChild} from '@angular/core';
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../../dto/sites/catan/game/GameConfig";
import {CatanService} from "../../../../services/sites/catan.service";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {Router} from "@angular/router";
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {ProjectService} from "../../../../services/project.service";
import {ProjectMetadata} from "../../../../dto/projects/ProjectMetadata";
import {CatanClearPopupComponent} from "../popups/clear-popup/clear-popup.component";
import {CatanUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";
import {GameSessionComponent} from "../../GameSessionComponent";
import {GameState} from "../../../../dto/sites/catan/game/GameState";

@Component({
    selector: 'catan-game-settings',
    imports: [
        SliderCheckboxComponent,
        NgOptimizedImage,
        FormsModule,
        NgForOf,
        NgIf,
        PlayerSelectComponent,
        MainHeaderComponent,
        CatanClearPopupComponent,
        CatanUpdatePopupComponent
    ],
    templateUrl: './config.component.html',
    standalone: true,
    styleUrl: './config.component.css'
})
export class CatanConfigComponent extends GameSessionComponent<GameConfig, GameState> {
    @ViewChild('clearPopup') clearPopup!: CatanClearPopupComponent;
    @ViewChild('updatePopup') updatePopup!: CatanUpdatePopupComponent;

    project!: ProjectMetadata;

    gameModes = Object.values(GameMode);

    constructor(protected catanService: CatanService, router: Router) {
        super(catanService, "catan", router);

        this.gameConfig = {
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
        };
    }

    isValidConfig() {
        if (this.gameConfig.gameMode === GameMode.ONE_VS_ONE) {
            return this.gameConfig.teams.length == 2;
        }

        return this.gameConfig.teams.length >= 2;
    }

    protected readonly GameMode = GameMode;
    protected readonly getGameModeName = getGameModeName;
}
