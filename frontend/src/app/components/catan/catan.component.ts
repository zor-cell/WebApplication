import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-catan',
  imports: [
    CatanGameSettingsComponent,
    NgIf,
    NgForOf,
    NgClass,
    DiceRollComponent,
    ProjectHeaderComponent
  ],
  templateUrl: './catan.component.html',
  standalone: true,
  styleUrl: './catan.component.css'
})
export class CatanComponent implements OnInit {
  project!: ProjectMetadata;
  gameState!: GameState;

  constructor(private globals: Globals, private projectService: ProjectService, private catanService: CatanService) {}

  ngOnInit() {
      this.projectService.getProject("catan").subscribe({
        next: res => {
          this.project = res.metadata;
        },
        error: err => {
          this.globals.handleError(err);
        }
      });

      this.catanService.getState().subscribe({
        next: res => {
          this.gameState = res;
        },
        error: err => {
          this.globals.handleError(err);
        }
      })
  }

  get currentRoll(): DiceRoll | null {
    if(this.gameState === null || this.gameState.diceRolls.length === 0) return null;

    return this.gameState.diceRolls[this.gameState.diceRolls.length - 1];
  }

  rollDice(isAlchemist = false) {
    this.catanService.rollDice(isAlchemist).subscribe({
      next: res => {
        this.gameState = res;
      },
      error: err => {
        this.globals.handleError(err);
      }
    })
  }

  protected readonly Array = Array;
}
