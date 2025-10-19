import {Component, input} from '@angular/core';
import {LinkedGameStats} from "../../../../dto/games/stats/LinkedGameStats";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'game-stats-meta',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './game-stats-meta.component.html',
  styleUrl: './game-stats-meta.component.css'
})
export class GameStatsMetaComponent {
  public label = input.required<string>();
  public subLabel = input<string>('');

  public data = input.required<undefined | string | LinkedGameStats<any>>();
  public formatted = input<any>(null);

  public defaultValue = input<string>('None');

  protected isLinkedGameStats(value: undefined | string | LinkedGameStats<any>) {
    if(!value) {
      return null;
    } else if(typeof value == 'object' && value.gameId !== undefined && value.value !== undefined) {
      return value as LinkedGameStats<any>;
    }
    return null;
  }
}
