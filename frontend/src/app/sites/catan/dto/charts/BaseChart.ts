import {ChartData, ChartOptions, ChartTypeRegistry, Plugin} from "chart.js";

export abstract class BaseChart {
    protected static readonly colors = ['rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgb(255, 187, 120, 0.8)'];

    static data: ChartData<keyof ChartTypeRegistry, any, any>;
    static options: ChartOptions;
    static plugins: Plugin[] = [];
}