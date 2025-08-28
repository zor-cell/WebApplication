import {Component, inject} from '@angular/core';
import {JollyService} from "../../../../services/sites/jolly.service";
import {GameSessionGameComponent} from "../../game-session/game-session-game.component";
import {GameState} from "../../../../dto/sites/catan/game/GameState";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent
  ],
  templateUrl: './game.component.html',
  standalone: true,
  styleUrl: './game.component.css'
})
export class JollyGameComponent {
  gameState!: GameState;

  protected jollyService = inject(JollyService);
}
