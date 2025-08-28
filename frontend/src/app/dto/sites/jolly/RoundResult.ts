import {Team} from "../../all/Team";

export interface RoundResult {
    team: Team,
    score: number,
    hasClosed: boolean
}