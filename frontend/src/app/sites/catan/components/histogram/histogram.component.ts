import {
    AfterViewInit,
    Component,
    effect,
    input,
    viewChildren,
} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DiceRoll} from "../../dto/DiceRoll";
import {GameConfig} from "../../dto/game/GameConfig";
import {ClassicDiceChartData, ClassicDiceChartOptions} from "../../dto/charts/ClassicDiceChart";
import {EventDiceChartData, EventDiceChartOptions, EventDiceChartPlugins} from "../../dto/charts/EventDiceChart";
import {NgIf} from "@angular/common";

@Component({
    selector: 'catan-histogram',
    imports: [
        BaseChartDirective,
        NgIf
    ],
    templateUrl: './histogram.component.html',
    standalone: true,
    styleUrl: './histogram.component.css'
})
export class CatanHistogramComponent implements AfterViewInit {
    public diceRolls = input.required<DiceRoll[]>();
    public isVisible = input<boolean>(true);
    public showEventDice = input<boolean>(false);
    public showExactProbability = input<boolean>(false);
    private charts = viewChildren(BaseChartDirective);

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
        const diceRolls = this.diceRolls();

        this.computeEventDiceData(diceRolls);
        this.computeClassicDiceData(diceRolls);

        this.charts().forEach((chart, i) => {
            if (!chart || !this.isVisible()) return;

            //update text
            if (chart.chart && chart.chart.options && chart.chart.options.plugins && chart.chart.options.plugins.title) {
                chart.chart.options.plugins.title.text = `Histogram of ${diceRolls.length} Rolls`;
            }

            chart.update();
        });
    }

    private computeClassicDiceData(diceRolls: DiceRoll[]) {
        //bell curve
        ClassicDiceChartData.datasets[0].data = this.generateBellCurveData(diceRolls.length);
        if(this.showExactProbability()) {
            ClassicDiceChartData.datasets[1].data = this.generateExactProbabilities(diceRolls.length);
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

        ClassicDiceChartData.datasets = [
            ClassicDiceChartData.datasets[0],
            ClassicDiceChartData.datasets[1],
            ...datasets];
    }

    private computeEventDiceData(diceRolls: DiceRoll[]) {
        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};

        teams.forEach(team => {
            teamData[team] = Array(4).fill(0);
        });
        diceRolls.forEach(diceRoll => {
            const pos = EventDiceChartData.labels?.indexOf(diceRoll.diceEvent);
            if(pos !== undefined) {
                teamData[diceRoll.teamName][pos]++;
            }
        });

        const colors = ['rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgb(255, 187, 120, 0.8)'];
        const datasets = teams.map((team, index) => ({
            type: 'bar',
            label: team,
            data: teamData[team],
            backgroundColor: colors[index % teams.length],
            order: 2
        }));

        EventDiceChartData.datasets = [...datasets];
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

    protected readonly ClassicDiceChartOptions = ClassicDiceChartOptions;
    protected readonly EventDiceChartOptions = EventDiceChartOptions;
    protected readonly ClassicDiceChartData = ClassicDiceChartData;
    protected readonly EventDiceChartData = EventDiceChartData;
    protected readonly EventDiceChartPlugins = EventDiceChartPlugins;
}
