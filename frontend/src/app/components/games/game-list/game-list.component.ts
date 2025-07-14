import {Component} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {GameMetadata} from "../../../dto/games/GameMetadata";
import {Router} from "@angular/router";
import {GameType} from "../../../dto/games/GameType";
import {MainHeaderComponent} from '../../all/main-header/main-header.component';

@Component({
  selector: 'game-list',
  imports: [
    NgForOf,
    DatePipe,
    DurationPipe,
    NgIf,
    MainHeaderComponent
  ],
  templateUrl: './game-list.component.html',
  standalone: true,
  styleUrl: './game-list.component.css'
})
export class GameListComponent {
  games!: GameMetadata[];
  dateFormat = 'MMM d, yyyy HH:mm';


  constructor(private router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.getProjects();

    //adjust date format
    const mql = window.matchMedia('(max-width: 600px)');
    this.updateDateFormat(mql.matches);

    mql.addEventListener('change', (e) => {
      this.updateDateFormat(e.matches);
    });
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

  private updateDateFormat(isSmallScreen: boolean) {
    this.dateFormat = isSmallScreen ? 'dd.MM.yyyy' : 'MMM d, yyyy HH:mm';
    console.log(this.dateFormat)
  }
}
