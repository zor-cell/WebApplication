import {Component, effect, input} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {state} from "@angular/animations";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {Team} from "../../../../dto/all/Team";

@Component({
  selector: 'jolly-round-table',
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './round-table.component.html',
  styleUrl: './round-table.component.css'
})
export class JollyRoundTableComponent {
  public gameState = input.required<GameState>();

  protected getTotalScore(team: Team): number {
    return this.gameState()!.rounds
        .map(r => r.results.find(res => res.team.name === team.name)?.score ?? 0)
        .reduce((a, b) => a + b, 0);
  }
}
