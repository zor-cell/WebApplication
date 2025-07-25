import {Component, Input} from '@angular/core';
import {DiceRoll} from "../../../../dto/sites/catan/DiceRoll";
import {NgIf} from "@angular/common";
import {GameMode} from "../../../../dto/sites/catan/enums/GameMode";

@Component({
    selector: 'catan-dice-roll',
    imports: [
        NgIf
    ],
    templateUrl: './dice-roll.component.html',
    standalone: true,
    styleUrl: './dice-roll.component.css'
})
export class CatanDiceRollComponent {
    @Input({required: true}) diceRoll!: DiceRoll | null;
    @Input({required: true}) gameMode!: GameMode;

    protected readonly GameMode = GameMode;
}
