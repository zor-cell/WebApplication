import {Component, effect, inject, input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {state} from "@angular/animations";
import {GameState} from "../../../../dto/sites/jolly/game/GameState";
import {Team} from "../../../../dto/all/Team";
import {LightboxDirective} from "ng-gallery/lightbox";
import {Gallery, ImageItem} from "ng-gallery";
import {round} from "@popperjs/core/lib/utils/math";

@Component({
  selector: 'jolly-round-table',
  imports: [
    NgForOf,
    NgIf,
    LightboxDirective,
    NgOptimizedImage
  ],
  templateUrl: './round-table.component.html',
  styleUrl: './round-table.component.css'
})
export class JollyRoundTableComponent implements OnInit {
  private gallery = inject(Gallery);
  protected readonly galleryName = "roundTableGallery";

  public gameState = input.required<GameState>();
  public showImages = input<boolean>(false);

  ngOnInit() {
    const roundImages = this.gameState().rounds.map(round => new ImageItem({
      src: round.imageUrl
    }));

    const galleryRef = this.gallery.ref(this.galleryName);
    galleryRef.load(roundImages);
  }

  protected getTotalScore(team: Team): number {
    return this.gameState()!.rounds
        .map(r => r.results.find(res => res.team.name === team.name)?.score ?? 0)
        .reduce((a, b) => a + b, 0);
  }
}
