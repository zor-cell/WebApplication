import {Component, Input, OnInit} from '@angular/core';
import {Tile} from "../../../dto/qwirkle/Tile";
import {Color} from "../../../dto/qwirkle/Color";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Shape} from "../../../dto/qwirkle/Shape";
import {AsyncPipe, NgIf} from "@angular/common";
import {SvgCacheService} from "../../../services/svg-cache.service";
import {Observable} from "rxjs";

@Component({
    selector: 'qwirkle-tile',
    imports: [
        NgIf,
        AsyncPipe
    ],
    templateUrl: './tile.component.html',
    standalone: true,
    styleUrl: './tile.component.css'
})
export class QwirkleTileComponent implements OnInit {
    @Input({required: true}) tile!: Tile;
    @Input() tileCount: number | null = null;
    @Input() isInteractive: boolean = true;

    svgContent!: Observable<SafeHtml>;

    private readonly ColorRGBMap: Record<Color, string> = {
        [Color.ORANGE]: "rgb(255, 165, 0)",
        [Color.PURPLE]: "rgb(128, 0, 128)",
        [Color.YELLOW]: "rgb(255, 255, 0)",
        [Color.RED]: "rgb(255, 0, 0)",
        [Color.GREEN]: "rgb(0, 128, 0)",
        [Color.BLUE]: "rgb(0, 0, 255)"
    };
    private readonly tileSize: number = 40;


    constructor(private httpClient: HttpClient, private svgCacheService: SvgCacheService) {
    }

    ngOnInit() {
        this.svgContent = this.svgCacheService.getSVG(
            `assets/qwirkle/${this.tile.shape.toLowerCase()}.svg`,
            this.ColorRGBMap[this.tile.color],
            this.tileSize,
            this.tileSize
        );
        //this.loadSVG(this.tile.shape, this.tile.color);
    }

    /*loadSVG(shape: Shape, color: Color) {
        const url = `assets/qwirkle/${shape.toLowerCase()}.svg`;

        if(this.svgCache.has(url)) {
            this.svgContent = this.svgCache.get(url)!;
            return;
        }

        this.httpClient.get(url, {responseType: 'text'})
            .subscribe(data => {
                let svg = data.replace(/fill="[^"]*"/g, `fill="${this.ColorRGBMap[color]}"`);
                svg = svg
                    .replace(/width="[^"]*"/, `width="${this.tileSize}"`)
                    .replace(/height="[^"]*"/, `height="${this.tileSize}"`);

                this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
            })
    }*/
}
