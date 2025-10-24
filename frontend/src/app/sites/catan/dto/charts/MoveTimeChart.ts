import {ChartData, ChartOptions} from "chart.js";
import {BaseChart} from "./BaseChart";
import {BaseChartOptions} from "./BaseChartOptions";
import {DiceRoll} from "../DiceRoll";

export class MoveTimeChart extends BaseChart {
    static override data: ChartData<any, number[], number> = {
        labels: [1, 2, 3],
        datasets: []
    }

    static override options: ChartOptions = {
        ...BaseChartOptions,
        scales: {
            x: {
                stacked: false
            },
            y: {
                stacked: false,
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
        elements: {
            line: {
                tension: 0.2, // smooth lines
                borderWidth: 2,
                fill: false,
            },
            point: {
                radius: 3,
            }
        },
    }

    static refresh(diceRolls: DiceRoll[]) {
        //team datasets
        const teams = [...new Set(diceRolls.map(d => d.teamName))];
        const teamData: any = {};
        const maxRounds = Math.ceil(diceRolls.length / teams.length);

        teams.forEach(team => {
            teamData[team] = Array(maxRounds).fill(null);
        });
        diceRolls.forEach((diceRoll, i) => {
            if(i < diceRolls.length - 1) {
                const cur = new Date(diceRolls[i].rollTime);
                const next = new Date(diceRolls[i + 1].rollTime);

                const duration = (next.getTime() - cur.getTime()) / 1000;

                const round: number = Math.floor(i / teams.length);
                teamData[diceRoll.teamName][round] = duration;
            }
        });

        const datasets = teams.map((team, index) => ({
            type: 'line',
            label: team,
            data: teamData[team],
            borderColor: BaseChart.colors[index % BaseChart.colors.length],
            backgroundColor: BaseChart.colors[index % teams.length],
            fill: false,
            order: 2
        }));

        MoveTimeChart.data.labels = Array.from(
            { length: maxRounds },
            (_, i) => i + 1
        );
        MoveTimeChart.data.datasets = [...datasets];

        MoveTimeChart.options = {
            ...MoveTimeChart.options,
            plugins: {
                ...MoveTimeChart.options.plugins,
                title: {
                    ...MoveTimeChart.options.plugins?.title,
                    text: `Move Time of ${diceRolls.length} Rolls`,
                }
            },
        }
    }
}