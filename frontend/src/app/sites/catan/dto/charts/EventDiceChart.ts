import {ChartData, ChartOptions, Plugin} from "chart.js";
import {BaseChartOptions} from "./BaseChartOptions";

const labelImages: Record<string, HTMLImageElement> = {
    g: Object.assign(new Image(), { src: 'assets/catan/g.svg' }),
    b: Object.assign(new Image(), { src: 'assets/catan/b.svg' }),
    y: Object.assign(new Image(), { src: 'assets/catan/y.svg' }),
    e: Object.assign(new Image(), { src: 'assets/catan/e.svg' })
};

const labelImagePlugin: Plugin<any> = {
    id: 'labelImagePlugin',
    afterDraw(chart: any) {
        const { ctx, chartArea, scales } = chart;
        const xAxis = scales.x;

        if (!xAxis) return;

        chart.data.labels.forEach((label: string, index: number) => {
            const image = labelImages[label];
            if (!image?.complete) return; // skip if not loaded yet

            const x = xAxis.getPixelForTick(index);
            const y = chartArea.bottom + 5; // space below axis

            const size = 20; // image size (px)
            ctx.drawImage(image, x - size / 2, y, size, size);
        });
    }
};

export const EventDiceChartData: ChartData<any, number[], string> = {
    labels: ['g', 'b', 'y', 'e'],
    datasets: []
}

export const EventDiceChartOptions: ChartOptions = {
    ...BaseChartOptions,
    plugins: {
        ...BaseChartOptions.plugins
    }
}

export const EventDiceChartPlugins: Plugin<any>[] = [labelImagePlugin]