import {Component, computed, effect, inject, signal} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {GameService} from "../../../../services/game.service";
import {GameComponentRegistryService} from "../../../../services/all/game-component-registry.service";
import {CorrelationChartComponent} from "../correlation-chart/correlation-chart.component";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {ActivatedRoute, Router} from "@angular/router";
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";

@Component({
    selector: 'game-stats',
    imports: [
        MainHeaderComponent,
        GameSearchComponent,
        NgForOf,
        NgIf,
        NgComponentOutlet,
        CorrelationChartComponent,
        CorrelationChartComponent,
        GameStatsMetaComponent,
        DurationPipe
    ],
    templateUrl: './game-stats.component.html',
    styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
    private gameService = inject(GameService);
    private componentRegistryService = inject(GameComponentRegistryService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    protected gameStats = signal<GameStats[]>([]);
    protected gameFilters = signal<GameFilters | null>(null);

    protected gameType = computed(() => {
        const gameTypes = this.gameFilters()?.gameTypes;
        if (!gameTypes || gameTypes.length != 1) {
            return null;
        }

        return gameTypes[0];
    });

    protected gameStatsComponent = computed(() => {
        const gameType = this.gameType();
        if (!gameType) return null;

        return this.componentRegistryService.getStatsComponent(gameType);
    });

    constructor() {
        this.route.queryParams.subscribe(params => {
            const filters: GameFilters = {
                text: params['text'] ?? null,
                dateFrom: params['dateFrom'] ?? null,
                dateTo: params['dateTo'] ?? null,
                minDuration: params['minDuration'] ?? null,
                maxDuration: params['maxDuration'] ?? null,
                gameTypes: [params['gameTypes'] ?? null],
                players: [params['players'] ?? null]
            };

            console.log("query", filters);

            const current = this.gameFilters();
            if (current === null || JSON.stringify(current) !== JSON.stringify(filters)) {
                console.log("set");
                this.gameFilters.set(filters);
            }
        });

        effect(() => {
            const filters = this.gameFilters();
            if (!filters) return;

            console.log("effect", filters);
            const queryParams: any = {
                text: filters.text,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                minDuration: filters.minDuration,
                maxDuration: filters.maxDuration,
                gameTypes: filters.gameTypes,
                players: filters.players,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams,
                queryParamsHandling: "merge",
                replaceUrl: true
            });

            this.getStats(filters);
        });
    }

    protected searchFiltersChanged(filters: GameFilters) {
        this.gameFilters.set(filters);
    }

    private getStats(filters: GameFilters | null) {
        this.gameService.getStats(filters).subscribe(res => {
            this.gameStats.set(res);
        })
    }
}
