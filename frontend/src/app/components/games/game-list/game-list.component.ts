import {Component} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {DatePipe, NgForOf} from "@angular/common";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {GameMetadata} from "../../../dto/games/GameMetadata";
import {Router} from "@angular/router";
import {GameType} from "../../../dto/games/GameType";

@Component({
  selector: 'game-list',
  imports: [
    NgForOf,
    DatePipe,
    DurationPipe
  ],
  templateUrl: './game-list.component.html',
  standalone: true,
  styleUrl: './game-list.component.css'
})
export class GameListComponent {
  games!: GameMetadata[];

  constructor(private router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  openGameInfo(id: string) {
    this.router.navigate(['/games', id]);
  }


  getProjects() {
    this.gameService.getGames().subscribe({
      next: res => {
        this.games = res;
      }
    });
  }
}
