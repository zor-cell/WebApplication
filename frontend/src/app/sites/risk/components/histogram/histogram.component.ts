import {Component, computed, effect, input, viewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DataEntry} from "../../dto/DataEntry";
import {ChartData, ChartOptions} from "chart.js";

@Component({
  selector: 'risk-histogram',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.css'
})
export class RiskHistogramComponent {
  public dataEntries = input.required<DataEntry[]>();
  public isVisible = input<boolean>(true);
  private chart = viewChild.required(BaseChartDirective);

  protected labels = computed(() => {
    return this.dataEntries().map(d => d.result).sort((a, b) => a - b);
  });
  protected labelData = computed(() => {
    const a = new Array(this.labels().length).fill(0);

    this.labels().forEach((label, i) => {
      const entry: DataEntry = this.dataEntries().find(x => x.result == label)!;
      a[i] = entry.count;
    });

    return a;
  });
  protected labelDataProb = computed(() => {
    const total = this.labelData().reduce((a, b) => a + b, 0);
    return this.labelData().map(d => d / total);
  });

  protected chartData: ChartData<any, number[], number> = {
    labels: [],
    datasets: []
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
        text: 'Histogram of Attacks',
        font: {
          size: 18,
          weight: 'bold',
        },
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    },
  };

  constructor() {
    effect(() => {
      if(this.dataEntries()) {
        this.refillChartData();
      }
    });
  }

  private refillChartData() {
    const dataset = {
      type: 'bar',
      label: 'Attackers left',
      data: this.labelDataProb()
    };

    this.chartData.labels = this.labels();
    this.chartData.datasets = [dataset];

    this.chart().update();
  }
}
