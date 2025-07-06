import { Component } from '@angular/core';
import {ProjectMetadata} from "../../../dto/projects/ProjectMetadata";
import {Globals} from "../../../classes/globals";
import {ProjectService} from "../../../services/project.service";
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'game-list',
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './game-list.component.html',
  standalone: true,
  styleUrl: './game-list.component.css'
})
export class GameListComponent {
  games!: GameDetails[];

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.getProjects();
  }


  getProjects() {
    this.gameService.getGames().subscribe({
      next: res => {
        this.games = res;
      }
    });
  }
}
