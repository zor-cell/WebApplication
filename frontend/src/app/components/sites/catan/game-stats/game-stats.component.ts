import {Component, input} from '@angular/core';
import {GameStats} from "../../../../dto/sites/catan/game/GameStats";
import {CatanHistogramComponent} from "../histogram/histogram.component";

@Component({
  selector: 'catan-game-stats',
    imports: [
        CatanHistogramComponent
    ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class CatanGameStatsComponent {
    public stats = input.required<GameStats>();
}
