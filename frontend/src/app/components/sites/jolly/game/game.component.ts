import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameSessionGameComponent} from "../../game-session/game-session-game.component";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {AuthService} from "../../../../services/all/auth.service";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {RoundPopupComponent} from "../popups/round-popup/round-popup.component";
import {RoundResult} from "../../../../dto/sites/jolly/RoundResult";
import {ReactiveFormsModule} from "@angular/forms";
import {Team} from "../../../../dto/all/Team";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent,
    NgIf,
    RoundPopupComponent,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class JollyGameComponent implements OnInit {
  private router = inject(Router);
  protected jollyService = inject(JollyService);
  protected authService = inject(AuthService);

  protected roundPopup = viewChild.required<RoundPopupComponent>("roundPopup");
  protected gameState = signal<GameState | null>(null);

  protected saveScores = computed<Record<string, number>>(() => {
    const state = this.gameState();
    if (!state) return {};

    const scores: Record<string, number> = {};

    // initialize all team scores with 0
    for (const team of state.gameConfig.teams) {
      scores[team.name] = 0;
    }

    // accumulate round results
    for (const round of state.rounds) {
      for (const res of round.results) {
        const teamName = res.team.name;
        scores[teamName] = (scores[teamName] ?? 0) + (res.score ?? 0);
      }
    }

    return scores;
  });

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

  protected openRoundPopup() {
    this.roundPopup().openPopup();
  }

  protected addRound(event: {results: RoundResult[], imageFile: File | null}) {
    this.jollyService.saveRound(event.results, event.imageFile).subscribe(res => {
      this.gameState.set(res);
    });
  }

  protected roundLimitReached() {
    if(this.gameState()!.gameConfig.noRoundLimit) {
      return false;
    }

    return this.gameState()!.rounds.length >= this.gameState()!.gameConfig.roundLimit;
  }

  protected getTotalScore(team: Team): number {
    return this.gameState()!.rounds
        .map(r => r.results.find(res => res.team.name === team.name)?.score ?? 0)
        .reduce((a, b) => a + b, 0);
  }
}
