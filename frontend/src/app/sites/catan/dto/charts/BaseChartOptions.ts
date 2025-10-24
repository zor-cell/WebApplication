import {ChartOptions} from "chart.js";

export const BaseChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    animations: {
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