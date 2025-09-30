import {CorrelationDataPoint} from "./CorrelationDataPoint";

export interface CorrelationResult {
    coefficient: number,
    slope: number,
    intercept: number,
    points: CorrelationDataPoint[]
}