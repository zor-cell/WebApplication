import {Component, inject, signal, viewChild} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {GameService} from "../../../../services/game.service";
import {GameComponentRegistryService} from "../../../../services/all/game-component-registry.service";
import {CorrelationChartComponent} from "../correlation-chart/correlation-chart.component";
import {BaseChartDirective} from "ng2-charts";

@Component({
    selector: 'game-stats',
    imports: [
        MainHeaderComponent,
        GameSearchComponent,
        NgForOf,
        NgIf,
        NgComponentOutlet,
        CorrelationChartComponent,
        CorrelationChartComponent
    ],
    templateUrl: './game-stats.component.html',
    styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
    private gameService = inject(GameService);
    private componentRegistryService = inject(GameComponentRegistryService);

    protected gameStats = signal<GameStats[]>([]);
    protected gameFilters = signal<GameFilters | null>(null);

    protected get gameStatsComponent() {
        const gameTypes = this.gameFilters()?.gameTypes;
        if (!gameTypes || gameTypes.length !== 1) return null;

        const gameType = gameTypes[0];
        return this.componentRegistryService.getStatsComponent(gameType);
    }

    protected searchFiltersChanged(filters: GameFilters) {
        this.gameFilters.set(filters);
        this.getStats(filters);
    }

    private getStats(filters: GameFilters) {
        this.gameService.getStats(filters).subscribe(res => {
            this.gameStats.set(res);
        })
    }
}
