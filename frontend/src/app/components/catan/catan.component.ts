import {Component, OnInit, ViewChild} from '@angular/core';
import {CatanGameSettingsComponent} from "./game-settings/game-settings.component";
import {GameState} from "../../dto/catan/GameState";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CatanService} from "../../services/catan.service";
import {Globals} from "../../classes/globals";
import {DiceRollComponent} from "./dice-roll/dice-roll.component";
import {DiceRoll} from "../../dto/catan/DiceRoll";
import {ProjectHeaderComponent} from "../projects/project-header/project-header.component";
import {ProjectService} from "../../services/project.service";
import {ProjectMetadata} from "../../dto/projects/responses";
import {BaseChartDirective} from "ng2-charts";
import {ChartData, ChartDataset, ChartOptions} from "chart.js";
import {HistogramComponent} from "./histogram/histogram.component";

@Component({
  selector: 'app-catan',
  imports: [
    CatanGameSettingsComponent,
    NgIf,
    NgForOf,
    NgClass,
    DiceRollComponent,
    ProjectHeaderComponent,
    BaseChartDirective,
    HistogramComponent
  ],
  templateUrl: './catan.component.html',
  standalone: true,
  styleUrl: './catan.component.css'
})
export class CatanComponent implements OnInit {
  gameState!: GameState;
  showChart: boolean = false;

  get currentRoll(): DiceRoll | null {
    if(!this.gameState || this.gameState.diceRolls.length === 0) return null;

    return this.gameState.diceRolls[this.gameState.diceRolls.length - 1];
  }

  constructor(private globals: Globals, private catanService: CatanService) {}

  ngOnInit() {
      this.catanService.state().subscribe({
        next: res => {
          this.gameState = res;
        },
        error: err => {
          this.globals.handleError(err);
        }
      })
  }


  rollDice(isAlchemist = false) {
    this.catanService.rollDice(isAlchemist).subscribe({
      next: res => {
        this.gameState = res;
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  toggleChart() {
    this.showChart = !this.showChart;
  }
  
  save(winnerTeam: string) {
    this.catanService.save(winnerTeam).subscribe({
      next: res => {

      },
      error: err => {
        this.globals.handleError(err);
      }
    })
  }
}
