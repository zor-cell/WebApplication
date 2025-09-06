import {Component, inject, OnInit, signal, viewChild, WritableSignal} from '@angular/core';
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameSessionGameComponent} from "../../game-session/game-session-game.component";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {AuthService} from "../../../../services/all/auth.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {RoundPopupComponent} from "../popups/round-popup/round-popup.component";
import {RoundResult} from "../../../../dto/sites/jolly/RoundResult";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {ReactiveFormsModule} from "@angular/forms";
import {Team} from "../../../../dto/all/Team";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent,
    NgIf,
    RoundPopupComponent,
    NgForOf,
    DatePipe,
    DurationPipe,
    ReactiveFormsModule
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class JollyGameComponent implements OnInit {
  protected roundPopup = viewChild.required<RoundPopupComponent>("roundPopup");
  protected gameState = signal<GameState | null>(null);

  protected jollyService = inject(JollyService);
  protected authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.getSession();
  }

  private getSession() {
    this.jollyService.getSession().subscribe({
      next: res => {
        this.gameState.set(res);
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
    this.jollyService.saveRound(roundResults).subscribe(res => {
      this.gameState.set(res);
    });
  }

  getTotalScore(team: Team): number {
    return this.gameState()!.rounds
        .map(r => r.results.find(res => res.team.name === team.name)?.score ?? 0)
        .reduce((a, b) => a + b, 0);
  }
}
