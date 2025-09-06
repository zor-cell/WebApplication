import {Component, inject, OnInit, viewChild} from '@angular/core';
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameSessionGameComponent} from "../../game-session/game-session-game.component";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {AuthService} from "../../../../services/all/auth.service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {RoundPopupComponent} from "../popups/round-popup/round-popup.component";
import {RoundResult} from "../../../../dto/sites/jolly/RoundResult";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent,
    NgIf,
    RoundPopupComponent
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class JollyGameComponent implements OnInit {
  gameState!: GameState;
  protected roundPopup = viewChild.required<RoundPopupComponent>("roundPopup");

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

  openRoundPopup() {
    this.roundPopup().openPopup();
  }

  addRound(roundResults: RoundResult[]) {
    console.log(roundResults)
  }

}
