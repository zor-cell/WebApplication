import {Component, Input, OnInit} from '@angular/core';
import {Tile} from "../../../dto/qwirkle/Tile";
import {Color} from "../../../dto/qwirkle/Color";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Shape} from "../../../dto/qwirkle/Shape";
import {NgIf} from "@angular/common";

@Component({
  selector: 'qwirkle-tile',
  imports: [
    NgIf
  ],
  templateUrl: './tile.component.html',
  standalone: true,
  styleUrl: './tile.component.css'
})
export class QwirkleTileComponent implements OnInit {
  @Input({required: true}) tile!: Tile;
  @Input() tileCount: number | null = null;

  svgContent: SafeHtml | null = null;

  private readonly ColorRGBMap: Record<Color, string> = {
    [Color.ORANGE]: "rgb(255, 165, 0)",
    [Color.PURPLE]: "rgb(128, 0, 128)",
    [Color.YELLOW]: "rgb(255, 255, 0)",
    [Color.RED]: "rgb(255, 0, 0)",
    [Color.GREEN]: "rgb(0, 128, 0)",
    [Color.BLUE]: "rgb(0, 0, 255)"
  };
  private readonly tileSize: number = 40;

  constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.loadSVG(this.tile.shape, this.tile.color);
  }

  loadSVG(shape: Shape, color: Color) {
    this.httpClient.get(`assets/qwirkle/${shape.toLowerCase()}.svg`, {responseType: 'text'})
        .subscribe(data => {
          let svg = data.replace(/fill="[^"]*"/g, `fill="${this.ColorRGBMap[color]}"`);
          svg = svg
              .replace(/width="[^"]*"/, `width="${this.tileSize}"`)
              .replace(/height="[^"]*"/, `height="${this.tileSize}"`);

          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
        })
  }
}
