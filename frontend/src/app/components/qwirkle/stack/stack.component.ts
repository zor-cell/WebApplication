import {Component, Input, OnInit} from '@angular/core';
import {QwirkleGameComponent} from "../game/game.component";
import {QwirkleService} from "../../../services/qwirkle.service";
import {StackTile} from "../../../dto/qwirkle/StackTile";
import {GameState} from "../../../dto/qwirkle/GameState";
import {QwirkleTileComponent} from "../tile/tile.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'qwirkle-stack',
  imports: [
    QwirkleTileComponent,
    NgForOf
  ],
  templateUrl: './stack.component.html',
  standalone: true,
  styleUrl: './stack.component.css'
})
export class QwirkleStackComponent implements OnInit {
  @Input({required: true}) stack: StackTile[] = [];



  ngOnInit() {
    console.log(this.stack)
  }
}
