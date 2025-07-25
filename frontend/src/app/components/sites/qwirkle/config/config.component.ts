import {Component, inject, OnInit} from '@angular/core';
import {QwirkleService} from "../../../../services/sites/qwirkle.service";
import {GameConfig} from "../../../../dto/sites/qwirkle/game/GameConfig";

@Component({
  selector: 'qwirkle-game-config',
  imports: [],
  templateUrl: './config.component.html',
  standalone: true,
  styleUrl: './config.component.css'
})
export class QwirkleConfigComponent implements OnInit {
  private qwirkleService = inject(QwirkleService);

  gameConfig: GameConfig = {
    teams: [],
    playingTeam: -1
  };
  hasSession: boolean = false;

  ngOnInit() {
    this.qwirkleService.getSession().subscribe(res => {
      this.gameConfig = res.gameConfig;
    });
  }

  private createSession() {
    this.qwirkleService.createSession({}).subscribe(res => {
      //this.gameState = res;

      //calculate center in next tick
      //setTimeout(() => this.calculateCenter(), 1);
    });
  }
}
