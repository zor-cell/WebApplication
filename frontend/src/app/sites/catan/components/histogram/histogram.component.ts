import {
    AfterViewInit,
    Component,
    effect,
    input,
    viewChildren,
} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DiceRoll} from "../../dto/DiceRoll";
import {ClassicDiceChart} from "../../dto/charts/ClassicDiceChart";
import {
    EventDiceChart,
} from "../../dto/charts/EventDiceChart";
import {NgIf} from "@angular/common";
import {MoveTimeChart} from "../../dto/charts/MoveTimeChart";
import {GameMode} from "../../dto/enums/GameMode";

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
    public gameMode = input<GameMode | null>(null);
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
        if(!this.isVisible()) return;

        const diceRolls = this.diceRolls();

        ClassicDiceChart.refresh(diceRolls, this.showExactProbability());
        EventDiceChart.refresh(diceRolls);
        MoveTimeChart.refresh(diceRolls, this.gameMode());

        //update chart changes
        this.charts().forEach(chart => {
            chart.update();
        });
    }

    protected readonly ClassicDiceChart = ClassicDiceChart;
    protected readonly EventDiceChart = EventDiceChart;
    protected readonly MoveTimeChart = MoveTimeChart;
    protected readonly GameMode = GameMode;
}
