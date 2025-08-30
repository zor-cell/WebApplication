import {Component, inject, OnInit} from '@angular/core';
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameSessionGameComponent} from "../../game-session/game-session-game.component";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {AuthService} from "../../../../services/all/auth.service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent,
    NgIf
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class JollyGameComponent implements OnInit {
  gameState!: GameState;

  protected jollyService = inject(JollyService);
  protected authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.getSession();
  }

  private getSession() {
    this.jollyService.getSession().subscribe({
      next: res => {
        this.gameState = res;
      },
      error: err => {
        this.router.navigate(['projects/jolly']);
      }
    });
  }

}
