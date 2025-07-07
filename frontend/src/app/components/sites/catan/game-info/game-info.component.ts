import {Component, Input} from '@angular/core';
import {GameMetadata} from "../../../../dto/games/GameMetadata";
import {GameState} from "../../../../dto/sites/catan/GameState";
import {ResultState} from "../../../../dto/sites/catan/ResultState";
import {NgForOf, NgIf} from "@angular/common";
import {CatanHistogramComponent} from "../histogram/histogram.component";

@Component({
  standalone: true,
  selector: 'catan-game-info',
  imports: [
    NgIf,
    CatanHistogramComponent,
    NgForOf
  ],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class CatanGameInfoComponent {
  @Input({required: true}) metadata?: GameMetadata;
  @Input({required: true}) gameState?: GameState;
  @Input({required: true}) resultState?: ResultState;
}
