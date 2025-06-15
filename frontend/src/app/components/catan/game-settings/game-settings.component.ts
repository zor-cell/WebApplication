import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
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
import {ProjectService} from "../../../services/project.service";
import {ProjectMetadata} from "../../../dto/projects/responses";
import {PopupService} from "../../../services/popup.service";
import {ClearPopupComponent} from "../popups/clear-popup/clear-popup.component";

@Component({
  selector: 'catan-game-settings',
  imports: [
    SliderCheckboxComponent,
    NgOptimizedImage,
    FormsModule,
    NgForOf,
    NgIf,
    PlayerSelectComponent,
    ProjectHeaderComponent,
    ClearPopupComponent
  ],
  templateUrl: './game-settings.component.html',
  standalone: true,
  styleUrl: './game-settings.component.css'
})
export class CatanGameSettingsComponent implements OnInit {
  @ViewChild('clearPopup') clearPopup!: ClearPopupComponent;

  project!: ProjectMetadata;
  gameConfig: GameConfig = {
    teams: [],
    classicDice: {
      isBalanced: true,
      shuffleThreshold: 5
    },
    eventDice: {
      isBalanced: false,
      shuffleThreshold: 2
    },
    maxShipTurns: 7
  };
  hasSession: boolean = false;

  constructor(private globals: Globals,
              private projectService: ProjectService,
              private catanService: CatanService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    //get project metadata for header
    this.projectService.getProject("catan").subscribe({
      next: res => {
        this.project = res.metadata;
      },
      error: err => {
        this.globals.handleError(err);
      }
    });

    //check if session state exists
    this.catanService.state().subscribe({
      next: res => {
        this.hasSession = true;
        this.gameConfig = res.gameConfig;
      },
      error: err => {
        this.globals.handleError(err, true);
      }
    });
  }

  startGame() {
    if(this.hasSession) return;

    this.catanService.start(this.gameConfig).subscribe({
      next: res => {
        this.goToGame();
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  continueGame() {
    if(!this.hasSession) return;

    this.goToGame();
  }

  openClearPopup() {
    this.clearPopup.openClearPopup();
  }

  private goToGame() {
    this.router.navigate(['game'], {relativeTo: this.route});
  }
}
