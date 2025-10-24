import {BaseChartOptions} from "./BaseChartOptions";
import {ChartData, ChartOptions} from "chart.js";

export const ClassicDiceChartData: ChartData<any, number[], number> = {
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
}

export const ClassicDiceChartOptions: ChartOptions = {
    ...BaseChartOptions,
    plugins: {
        ...BaseChartOptions.plugins,
        legend: {
            labels: {
                filter: item => item.text !== 'Bell Curve' && item.text !== 'Exact Probabilities'
            }
        }
    }
}