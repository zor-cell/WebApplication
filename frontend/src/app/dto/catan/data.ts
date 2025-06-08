export interface DiceConfig {
    isBalanced: boolean,
    cards: number[],
    shuffleThreshold: number,
    cardsLeft: number[]
}