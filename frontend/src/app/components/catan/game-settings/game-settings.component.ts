import {Component, EventEmitter, Output} from '@angular/core';
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../dto/catan/GameConfig";
import {CatanService} from "../../../services/catan.service";
import {Globals} from "../../../classes/globals";
import {GameState} from "../../../dto/catan/GameState";
import {PlayerConfig} from "../../../dto/connect4/data";
import {PlayerSelectComponent} from "../../global/player-select/player-select.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectHeaderComponent} from "../../projects/project-header/project-header.component";

@Component({
  selector: 'catan-game-settings',
  imports: [
    SliderCheckboxComponent,
    NgOptimizedImage,
    FormsModule,
    NgForOf,
    NgIf,
    PlayerSelectComponent,
    ProjectHeaderComponent
  ],
  templateUrl: './game-settings.component.html',
  standalone: true,
  styleUrl: './game-settings.component.css'
})
export class CatanGameSettingsComponent {
  gameConfig: GameConfig = {
    teams: [],
    classicDice: {
      isBalanced: true,
      shuffleThreshold: 5
    },
    eventDice: {
      isBalanced: false,
      shuffleThreshold: 5
    },
    maxShipTurns: 7
  };

  constructor(private globals: Globals, private catanService: CatanService, private router: Router, private route: ActivatedRoute) {}

  clear() {
    this.catanService.clear().subscribe({
      next: res => {

      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  startGame() {
    this.catanService.start(this.gameConfig).subscribe({
      next: res => {
        this.router.navigate(['game'], {relativeTo: this.route});
      },
      error: err => {
        this.globals.handleError(err);
      }
    })
  }
}
