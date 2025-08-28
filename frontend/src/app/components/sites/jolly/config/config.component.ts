import {Component, inject, signal} from '@angular/core';
import {GameSessionConfigComponent} from "../../game-session/game-session-config.component";
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameConfig} from "../../../../dto/sites/jolly/game/GameConfig";

@Component({
  selector: 'jolly-game-config',
  imports: [
    GameSessionConfigComponent
  ],
  templateUrl: './config.component.html',
  standalone: true,
  styleUrl: './config.component.css'
})
export class JollyConfigComponent {
  protected gameConfig = signal<GameConfig>({
    teams: [],
    roundLimit: 0,
    noRoundLimit: true
  });

  protected readonly projectName = "catan";

  protected jollyService = inject(JollyService);

  isValidConfig() {
    return this.gameConfig().teams.length >= 2;
  }
}
