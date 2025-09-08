import {Component, inject, OnInit} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {GameMetadata} from "../../../dto/games/GameMetadata";
import {Router} from "@angular/router";
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
export class GameListComponent implements OnInit {
  private router = inject(Router);
  private gameService = inject(GameService);

  protected dateFormat = 'MMM d, yyyy HH:mm';
  protected games!: GameMetadata[];

  ngOnInit(): void {
    this.getProjects();

    //adjust date format
    const mql = window.matchMedia('(max-width: 600px)');
    this.updateDateFormat(mql.matches);

    mql.addEventListener('change', (e) => {
      this.updateDateFormat(e.matches);
    });
  }

  protected openGameInfo(id: string) {
    this.router.navigate(['/games', id]);
  }


  private getProjects() {
    this.gameService.getGames().subscribe({
      next: res => {
        this.games = res;
      }
    });
  }

  private updateDateFormat(isSmallScreen: boolean) {
    this.dateFormat = isSmallScreen ? 'dd.MM.yyyy' : 'MMM d, yyyy HH:mm';
  }
}
