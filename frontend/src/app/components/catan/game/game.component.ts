import {Component, OnInit, ViewChild} from '@angular/core';
import {CatanConfigComponent} from "../config/config.component";
import {GameState} from "../../../dto/catan/GameState";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CatanService} from "../../../services/catan.service";
import {Globals} from "../../../classes/globals";
import {CatanDiceRollComponent} from "../dice-roll/dice-roll.component";
import {DiceRoll} from "../../../dto/catan/DiceRoll";
import {ProjectHeaderComponent} from "../../projects/project-header/project-header.component";
import {BaseChartDirective} from "ng2-charts";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CatanSavePopupComponent} from "../popups/save-popup/save-popup.component";
import {Router} from "@angular/router";
import {Team} from "../../../dto/global/Team";
import {AuthService} from "../../../services/auth.service";
import {GameMode} from "../../../dto/catan/GameMode";

@Component({
  selector: 'catan-game',
  imports: [
    CatanConfigComponent,
    NgIf,
    NgForOf,
    NgClass,
    CatanDiceRollComponent,
    ProjectHeaderComponent,
    BaseChartDirective,
    CatanHistogramComponent,
    ReactiveFormsModule,
    CatanSavePopupComponent
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class CatanGameComponent implements OnInit {
  @ViewChild('savePopup') savePopup!: CatanSavePopupComponent;

  gameState!: GameState;
  showChart: boolean = false;

  get currentRoll(): DiceRoll | null {
    if(!this.gameState) return null;

    if(this.gameState.diceRolls.length === 0) return {
      dicePair: {
        dice1: 4,
        dice2: 3,
        event: '-'
      },
      diceEvent: 'b',
      teamName: ''
    };


    return this.gameState.diceRolls[this.gameState.diceRolls.length - 1];
  }

  get lastPlayer(): Team | null {
    if(!this.gameState || this.gameState.gameConfig.teams.length === 0 || this.gameState.diceRolls.length === 0) return null;

    const lastRollTeam = this.gameState.diceRolls[this.gameState.diceRolls.length - 1].teamName;
    const found = this.gameState.gameConfig.teams.find(team => team.name === lastRollTeam);
    if(found === undefined) {
      return null;
    }

    return found;

    /*const index = (this.gameState.currentPlayerTurn - 1 + this.gameState.gameConfig.teams.length) % this.gameState.gameConfig.teams.length;
    return this.gameState.gameConfig.teams[index];*/
  }

  constructor(private globals: Globals,
              private catanService: CatanService,
              private router: Router,
              public authService: AuthService) {}

  ngOnInit() {
    this.getSession();
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

  openSavePopup() {
    this.savePopup.openPopup();
  }

  private getSession() {
    this.catanService.state().subscribe({
      next: res => {
        this.gameState = res;
      },
      error: err => {
        this.router.navigate(['projects/catan']);

        this.globals.handleError(err);
      }
    });
  }

  protected readonly GameMode = GameMode;
}
