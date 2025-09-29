import {Component, inject, signal, Type, viewChild} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {GameService} from "../../../../services/game.service";
import {GameType} from "../../../../dto/games/GameType";
import {CatanGameStatsComponent} from "../../../sites/catan/game-stats/game-stats.component";
import {BaseChartDirective} from "ng2-charts";
import {ChartData, ChartOptions} from "chart.js";
import {JollyGameStatsComponent} from "../../../sites/jolly/game-stats/game-stats.component";
import {GameComponentRegistryService} from "../../../../services/all/game-component-registry.service";

@Component({
  selector: 'game-stats',
  imports: [
    MainHeaderComponent,
    GameSearchComponent,
    NgForOf,
    NgIf,
    NgComponentOutlet
  ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
  private gameService = inject(GameService);
  private componentRegistryService = inject(GameComponentRegistryService);

  protected gameStats = signal<GameStats[]>([]);
  protected gameFilters = signal<GameFilters | null>(null);
  private chart = viewChild.required(BaseChartDirective);

  protected get gameStatsComponent() {
    const gameTypes = this.gameFilters()?.gameTypes;
    if(!gameTypes || gameTypes.length !== 1) return null;

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

  protected chartData: ChartData<any, number[], number> = {
    labels: [],
    datasets: [
      {
        type: 'line',
        label: 'Correlation Starting Position - Winning',
        data: [],
        tension: 0.4,             // smooth curve
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,               // optional: fill under the curve
        pointRadius: 5,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }
    ]
  };
  protected chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    animations: {
      // Define animations for dataset elements during updates
      x: {
        duration: 500,
        easing: 'easeOutQuart'
      },
      y: {
        duration: 500,
        easing: 'easeOutQuart'
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Histogram of Dice Rolls',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      legend: {
        labels: {
          filter: item => item.text !== 'Bell Curve'
        }
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value.toString();
            }
            return '';
          },
          stepSize: 1
        },
      }
    },
  };


  protected refillChartData(stats: GameStats) {
    const chart = this.chart();

    if (!chart) return;

    //bell curve
    this.chartData.labels = stats.startPosCorrelation.map(p => p.dimension + 1);
    this.chartData.datasets[0].data = stats.startPosCorrelation.map(p => p.correlation);

    this.chartData.datasets = [this.chartData.datasets[0]];

    chart.update();
  }
}
