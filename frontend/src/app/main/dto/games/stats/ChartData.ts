import {ChartDataEntry} from "./ChartDataEntry";

export interface ChartData<X, Y> {
    entries: ChartDataEntry<X, Y>[]
}