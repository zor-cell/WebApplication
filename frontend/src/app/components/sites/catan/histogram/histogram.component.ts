import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {DiceRoll} from "../../../../dto/sites/catan/DiceRoll";

@Component({
    selector: 'catan-histogram',
    imports: [
        BaseChartDirective
    ],
    templateUrl: './histogram.component.html',
    standalone: true,
    styleUrl: './histogram.component.css'
})
export class CatanHistogramComponent implements OnChanges, AfterViewInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
    @Input({required: true}) diceRolls!: DiceRoll[];
    @Input() isVisible: boolean = false;

    chartData: ChartData<any, number[], number> = {
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
                order: 1
            }
        ]
    };
    chartOptions: ChartOptions = {
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

    ngAfterViewInit() {
        this.refillChartData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['diceRolls']) {
            this.refillChartData();
        }

        if (changes['isVisible']) {
            const currentValue = changes['isVisible'].currentValue;
            if (currentValue === true) {
                this.refillChartData();
            }
        }
    }

    private refillChartData() {
        if (!this.chart || !this.isVisible) return;

        //update text
        if (this.chart.chart && this.chart.chart.options && this.chart.chart.options.plugins && this.chart.chart.options.plugins.title) {
            this.chart.chart.options.plugins.title.text = `Histogram of ${this.diceRolls.length} Rolls`;
        }


        //bell curve
        this.chartData.datasets[0].data = this.generateBellCurveData(this.diceRolls.length);

        //team datasets
        const teams = [...new Set(this.diceRolls.map(d => d.teamName))];
        const teamData: any = {};

        teams.forEach(team => {
            teamData[team] = Array(11).fill(0);
        });
        this.diceRolls.forEach(diceRoll => {
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

        this.chartData.datasets = [this.chartData.datasets[0], ...datasets];

        this.chart.update();
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
