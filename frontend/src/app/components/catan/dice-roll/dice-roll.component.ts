import {Component, Input} from '@angular/core';
import {DiceRoll} from "../../../dto/catan/DiceRoll";
import {NgIf} from "@angular/common";

@Component({
  selector: 'catan-dice-roll',
  imports: [
    NgIf
  ],
  templateUrl: './dice-roll.component.html',
  standalone: true,
  styleUrl: './dice-roll.component.css'
})
export class DiceRollComponent {
    @Input({required: true}) diceRoll!: DiceRoll | null;
}
