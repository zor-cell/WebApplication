import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {NgIf} from "@angular/common";
import {DiceRoll} from "../../../dto/catan/DiceRoll";

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
export class CatanHistogramComponent implements OnChanges, OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input({required: true}) diceRolls!: DiceRoll[];
  @Input() isVisible: boolean = false;

  chartData: ChartData<any, number[], number> = {
    labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        type: 'bar',
        label: 'Roll Frequency',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgb(31, 119, 180)',
        order: 2
      },
      {
        type: 'line',
        label: 'Bell Curve',
        data: [], // We'll compute this below
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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
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

  ngOnInit() {
    this.refillChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['diceRolls']) {
        this.refillChartData();
    }

    if(changes['isVisible']) {
      const currentValue = changes['isVisible'].currentValue;
      if(currentValue === true) {
        this.refillChartData();
      }
    }
  }

  private refillChartData() {
    if(!this.chart) return;

    //update text
    if (this.chart.chart && this.chart.chart.options && this.chart.chart.options.plugins && this.chart.chart.options.plugins.title) {
      this.chart.chart.options.plugins.title.text =`Histogram of ${this.diceRolls.length} Rolls`;
    }


    //bell curve
    this.chartData.datasets[1].data = this.generateBellCurveData(this.diceRolls.length);

    //histogram
    const data = this.chartData.datasets[0].data;
    data.fill(0);

    for(const diceRoll of this.diceRolls) {
      const sum = diceRoll.dicePair.dice1 + diceRoll.dicePair.dice2;

      data[sum - 2]++;
    }

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
}
