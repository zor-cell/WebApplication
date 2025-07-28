import {Component, inject, OnInit, signal} from '@angular/core';
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {GameConfig} from "../../../../dto/sites/qwirkle/game/GameConfig";
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {PlayerSelectComponent} from "../../../all/player-select/player-select.component";
import {SliderCheckboxComponent} from "../../../all/slider-checkbox/slider-checkbox.component";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";

@Component({
    selector: 'qwirkle-game-config',
    imports: [
        GameSessionConfigComponent,
        FormsModule,
        NgForOf,
        PlayerSelectComponent,
    ],
    templateUrl: './config.component.html',
    standalone: true,
    styleUrl: './config.component.css'
})
export class QwirkleConfigComponent {
    //TODO implement form groups for config inputs
    gameConfig = signal<GameConfig>({
        teams: [],
        playingTeam: -1
    });
    protected readonly projectName = "qwirkle";

    protected qwirkleService = inject(QwirkleService);

    isValidConfig() {
        return true;
    }

    updatePlayingTeam(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.options[selectElement.selectedIndex].value;

        this.gameConfig().playingTeam = parseInt(selectedValue);
    }

    protected readonly getGameModeName = getGameModeName;
    protected readonly GameMode = GameMode;
}
