import {Component, OnInit, ViewChild} from '@angular/core';
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GameConfig} from "../../../dto/catan/GameConfig";
import {CatanService} from "../../../services/catan.service";
import {Globals} from "../../../classes/globals";
import {PlayerSelectComponent} from "../../global/player-select/player-select.component";
import {Router} from "@angular/router";
import {ProjectHeaderComponent} from "../../projects/project-header/project-header.component";
import {ProjectService} from "../../../services/project.service";
import {ProjectMetadata} from "../../../dto/projects/responses";
import {CatanClearPopupComponent} from "../popups/clear-popup/clear-popup.component";
import {CatanUpdatePopupComponent} from "../popups/update-popup/update-popup.component";
import {GameMode} from "../../../dto/catan/GameMode";

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
    CatanClearPopupComponent,
    CatanUpdatePopupComponent
  ],
  templateUrl: './config.component.html',
  standalone: true,
  styleUrl: './config.component.css'
})
export class CatanConfigComponent implements OnInit {
  @ViewChild('clearPopup') clearPopup!: CatanClearPopupComponent;
  @ViewChild('updatePopup') updatePopup!: CatanUpdatePopupComponent;

  project!: ProjectMetadata;
  gameConfig: GameConfig = {
    teams: [],
    gameMode: GameMode.CITIES_AND_KNIGHTS,
    classicDice: {
      isBalanced: true,
      shuffleThreshold: 5,
      useEvents: false
    },
    eventDice: {
      isBalanced: false,
      shuffleThreshold: 2,
      useEvents: false
    },
    maxShipTurns: 7
  };
  hasSession: boolean = false;
  originalConfig: GameConfig | null = null;

  gameModes = Object.values(GameMode);

  constructor(private globals: Globals,
              private projectService: ProjectService,
              private catanService: CatanService,
              private router: Router) {}

  ngOnInit(): void {
    //get project metadata for header
    this.projectService.getProject("catan").subscribe({
      next: res => {
        this.project = res.metadata;
      }
    });

    //check if session state exists
    this.catanService.state().subscribe({
      next: res => {
        this.hasSession = true;
        this.gameConfig = res.gameConfig;

        this.originalConfig = structuredClone(this.gameConfig);
      }
    });
  }

  startGame() {
    if(this.hasSession) return;

    this.catanService.start(this.gameConfig).subscribe({
      next: res => {
        this.goToGame();
      }
    });
  }

  continueGame() {
    if(!this.hasSession || this.originalConfig === null) return;

    //only show popup if changes to the config have been made
    if(this.configsAreEqual(this.gameConfig, this.originalConfig)) {
      this.goToGame();
    } else {
      this.openUpdatePopup();
    }
  }

  openClearPopup() {
    this.clearPopup.openPopup();
  }

  openUpdatePopup() {
    this.updatePopup.openPopup();
  }

  goToGame() {
    this.router.navigate(['projects/catan/game']);
  }

  isValidConfig() {
    if(this.gameConfig.gameMode === GameMode.ONE_VS_ONE) {
      return this.gameConfig.teams.length == 2;
    }

    return this.gameConfig.teams.length >= 2;
  }

  mapGameMode(mode: string): string {
    if(mode === GameMode.ONE_VS_ONE) {
      return '1 vs 1';
    } else if(mode === GameMode.CLASSIC) {
      return 'Classic';
    }

    return 'Cities and Knights';
  }

  private configsAreEqual(config1: GameConfig, config2: GameConfig): boolean {
    return JSON.stringify(config1) === JSON.stringify(config2);
  }

  protected readonly GameMode = GameMode;
}
