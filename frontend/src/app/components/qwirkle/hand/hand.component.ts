import {Component, OnInit} from '@angular/core';
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {Hand} from "../../../dto/qwirkle/Hand";
import {Color} from "../../../dto/qwirkle/Color";
import {Shape} from "../../../dto/qwirkle/Shape";
import {NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {QwirkleTileComponent} from "../tile/tile.component";

@Component({
  selector: 'qwirkle-hand',
  imports: [
    NgForOf,
    QwirkleTileComponent
  ],
  templateUrl: './hand.component.html',
  standalone: true,
  styleUrl: './hand.component.css'
})
export class QwirkleHandComponent {
  private gameState: GameState | null = null;
  hand: Hand = {
    tiles: [
      {color: Color.BLUE, shape: Shape.CLOVER},
      {color: Color.RED, shape: Shape.CLOVER},
      {color: Color.ORANGE, shape: Shape.CIRCLE},
      {color: Color.RED, shape: Shape.CLOVER},
      {color: Color.RED, shape: Shape.CLOVER},
      {color: Color.RED, shape: Shape.CLOVER},
    ]
  };

  constructor(private qwirkleService: QwirkleService, ) {

  }
}
