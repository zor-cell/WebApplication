import {DicePair} from "./DicePair";

export interface DiceRoll {
    dicePair: DicePair,
    diceEvent: string,
    teamName: string,
    rollTime: string
}