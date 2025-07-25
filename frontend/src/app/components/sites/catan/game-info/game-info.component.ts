import {Component, Input, OnInit} from '@angular/core';
import {GameMetadata} from "../../../../dto/games/GameMetadata";
import {GameState} from "../../../../dto/sites/catan/game/GameState";
import {ResultState} from "../../../../dto/sites/catan/result/ResultState";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {GameMode, getGameModeName} from "../../../../dto/sites/catan/enums/GameMode";
import {Tile} from "../../../../dto/sites/qwirkle/tile/Tile";
import {Team} from "../../../../dto/all/Team";
import {ResultTeamState} from "../../../../dto/sites/catan/result/ResultTeamState";

@Component({
  standalone: true,
  selector: 'catan-game-info',
  imports: [
    NgIf,
    CatanHistogramComponent,
    NgForOf,
    DatePipe,
    DurationPipe
  ],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class CatanGameInfoComponent implements OnInit {
  @Input({required: true}) metadata?: GameMetadata;
  @Input({required: true}) gameState?: GameState;
  @Input({required: true}) resultState?: ResultState;

  mean: number = 0;
  variance: number = 0;
  stdDev: number = 0;
  skew: number = 0;

  maxScore: number = 0;

  get paddedTeams(): (ResultTeamState | null)[] {
    if(!this.resultState) return [];

    const maxTeamSize = 4;
    const padded: (ResultTeamState | null)[] = [...this.resultState.teams];
    while (padded.length < maxTeamSize) {
      padded.push(null);
    }
    return padded;
  }

  ngOnInit() {
    if(this.resultState?.teams) {
      this.maxScore = Math.max(...this.resultState.teams.map(t => t.score));
    }

    if(this.gameState) {
      const diceSums = this.gameState.diceRolls.map(roll => roll.dicePair.dice1 + roll.dicePair.dice2);

      const mean = diceSums.reduce((acc, val) => acc + val, 0) / diceSums.length;
      const squaredDiffs = diceSums.map(val => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / diceSums.length;
      const stdDev = Math.sqrt(variance);
      const skew = this.skewness(diceSums);

      this.mean = mean;
      this.variance = variance;
      this.stdDev = stdDev;
      this.skew = skew;
    }
  }

  private skewness(arr: number[]) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;

    const s2 = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const s = Math.sqrt(s2);

    const skew = arr.reduce((acc, val) => acc + Math.pow((val - mean) / s, 3), 0);

    return (n / ((n - 1) * (n - 2))) * skew;
  }

  protected readonly GameMode = GameMode;
  protected readonly getGameModeName = getGameModeName;
}
