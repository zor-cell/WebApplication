import {Component, input} from '@angular/core';
import {GameStats} from "../../dto/game/GameStats";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {GameStatsMetaComponent} from "../../../../main/components/games/stats/game-stats-meta/game-stats-meta.component";
import {DurationPipe} from "../../../../main/pipes/DurationPipe";

@Component({
    selector: 'catan-game-stats',
    imports: [
        CatanHistogramComponent,
        GameStatsMetaComponent,
        DurationPipe
    ],
    templateUrl: './game-stats.component.html',
    styleUrl: './game-stats.component.css',
    standalone: true
})
export class CatanGameStatsComponent {
    public stats = input.required<GameStats>();
}
