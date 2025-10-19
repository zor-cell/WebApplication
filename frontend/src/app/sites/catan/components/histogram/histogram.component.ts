import {
    AfterViewInit,
    Component,
    effect,
    input,
    viewChild,
} from '@angular/core';
import {ChartData, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {DiceRoll} from "../../dto/DiceRoll";

@Component({
    selector: 'catan-histogram',
    imports: [
        BaseChartDirective
    ],
    templateUrl: './histogram.component.html',
    standalone: true,
    styleUrl: './histogram.component.css'
})
export class CatanHistogramComponent implements AfterViewInit {
    public diceRolls = input.required<DiceRoll[]>();
    public isVisible = input<boolean>(true);
    public showExactProbability = input<boolean>(false);
    private chart = viewChild.required(BaseChartDirective);

    protected chartData: ChartData<any, number[], number> = {
        labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
            {
                type: 'line',
                label: 'Bell Curve',
                data: [], // compute below
                tension: 0.4,
                pointRadius: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: 'rgba(255, 0, 0, 0.6)',
                borderWidth: 2,
                order: 1,
                yAxisID: 'yLine'
            },
            {
                type: 'line',
                label: 'Exact Probabilities',
                data: [], // compute below
                tension: 0,
                pointRadius: 0,
                borderColor: 'rgba(200, 200, 200, 0.8)',
                borderWidth: 2,
                order: 1,
                yAxisID: 'yLine'
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
                    filter: item => item.text !== 'Bell Curve' && item.text !== 'Exact Probabilities'
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
            },
            yLine: {
                stacked: false,
                beginAtZero: true,
                display: false
            }
        },
    };

    constructor() {
        effect(() => {
           if(this.diceRolls() && this.isVisible()) {
               this.refillChartData();
           }
        });
    }

    ngAfterViewInit(): void {
        this.refillChartData();
    }

    private refillChartData() {
        const chart = this.chart();
        const diceRolls = this.diceRolls();

        if (!chart || !this.isVisible()) return;

        //update text
        if (chart.chart && chart.chart.options && chart.chart.options.plugins && chart.chart.options.plugins.title) {
            chart.chart.options.plugins.title.text = `Histogram of ${diceRolls.length} Rolls`;
        }


        //bell curve
        this.chartData.datasets[0].data = this.generateBellCurveData(diceRolls.length);
        if(this.showExactProbability()) {
            this.chartData.datasets[1].data = this.generateExactProbabilities(diceRolls.length);
        }

        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};

        teams.forEach(team => {
            teamData[team] = Array(11).fill(0);
        });
        diceRolls.forEach(diceRoll => {
            const sum = diceRoll.dicePair.dice1 + diceRoll.dicePair.dice2;
            teamData[diceRoll.teamName][sum - 2]++;
        });

        const colors = ['rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgb(255, 187, 120, 0.8)'];
        const datasets = teams.map((team, index) => ({
            type: 'bar',
            label: team,
            data: teamData[team],
            backgroundColor: colors[index % teams.length],
            order: 2
        }));

        this.chartData.datasets = [
            this.chartData.datasets[0],
            this.chartData.datasets[1],
            ...datasets];

        chart.update();
    }

    private generateBellCurveData(totalRolls: number): number[] {
        const mean = 7;
        const variance = 35 / 6;
        const stdDev = Math.sqrt(variance);

        // labels for sums 2 through 12
        const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // Normal distribution formula (PDF):
        // f(x) = (1 / (σ * sqrt(2π))) * exp(-0.5 * ((x - μ)/σ)^2)
        return labels.map(x => {
            const z = (x - mean) / stdDev;
            const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
            return pdf * totalRolls;  // scale to total rolls so curve height matches histogram scale
        });
    }

    private generateExactProbabilities(totalRolls: number): number[] {
        const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        const probabilities: { [key: number]: number } = {
            2: 1 / 36,
            3: 2 / 36,
            4: 3 / 36,
            5: 4 / 36,
            6: 5 / 36,
            7: 6 / 36,
            8: 5 / 36,
            9: 4 / 36,
            10: 3 / 36,
            11: 2 / 36,
            12: 1 / 36
        };

        return labels.map(sum => probabilities[sum] * totalRolls);
    }
}
