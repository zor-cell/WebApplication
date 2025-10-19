import {Team} from "../../../main/dto/all/Team";

export interface RoundResult {
    team: Team,
    score: number,
    hasClosed: boolean,
    outInOne: boolean
}