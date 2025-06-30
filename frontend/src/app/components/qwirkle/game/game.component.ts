import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QwirkleHandComponent} from "../hand/hand.component";
import {QwirkleStackComponent} from "../stack/stack.component";
import {MainHeaderComponent} from "../../global/main-header/main-header.component";
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {Shape} from "../../../dto/qwirkle/Shape";
import {Color} from "../../../dto/qwirkle/Color";
import {Tile} from "../../../dto/qwirkle/Tile";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Position} from "../../../dto/qwirkle/Position";
import {Move} from "../../../dto/qwirkle/Move";
import {PositionInfo} from "../../../dto/qwirkle/PositionInfo";
import {Direction} from "../../../dto/qwirkle/Direction";
import {MoveGroup} from "../../../dto/qwirkle/MoveGroup";

@Component({
    selector: 'qwirkle-game',
    imports: [
        QwirkleHandComponent,
        QwirkleStackComponent,
        MainHeaderComponent,
        NgIf,
        QwirkleTileComponent,
        NgForOf,
        NgStyle
    ],
    templateUrl: './game.component.html',
    standalone: true,
    styleUrl: './game.component.css'
})
export class QwirkleGameComponent implements OnInit {
    @ViewChild('board') boardRef!: ElementRef;

    private readonly center: Position = {
        i: 0,
        j: 0
    };
    private readonly tileSize = 40;

    gameState: GameState | null = null;
    hand: Tile[] = [
        {color: Color.BLUE, shape: Shape.CLOVER}
    ];
    openPositions: PositionInfo[] = [];
    validMoves: MoveGroup[] = [];

    constructor(private qwirkleService: QwirkleService) {
    }

    ngOnInit() {
        this.getState();
    }

    selectedInHand(tiles: Tile[]) {
        this.getValidMoves(tiles);
    }

    selectedInStack(tile: Tile) {
        this.drawTile(tile);
    }

    chooseValidMove(moveIndex: number) {

    }

    getTilePositionStyle(position: Position) {
        return {
            left: `${this.center.j + position.j * this.tileSize - this.tileSize / 2}px`,
            bottom: `${this.center.i + position.i * this.tileSize - this.tileSize / 2}px`,
            width: `${this.tileSize}px`,
            height: `${this.tileSize}px`
        }
    }

    getValidMoveGroupStyle(moveGroup: MoveGroup) {
        const borderMap: Record<Direction, string> = {
            [Direction.UP]: 'border-top-width',
            [Direction.RIGHT]: 'border-right-width',
            [Direction.DOWN]: 'border-bottom-width',
            [Direction.LEFT]: 'border-left-width',
        };
        let borderWidth = 4;
        if(moveGroup.tiles.length === 1) {
            borderWidth = 1;
        }

        const style: Record<string, string> = {
            ...this.getTilePositionStyle(moveGroup.position)
        }

        for (const direction of moveGroup.directions) {
            const cssProp = borderMap[direction];
            if (cssProp) {
                style[cssProp] = `${borderWidth}px`;
            }
        }

        return style;
    }

    private calculateCenter() {
        if (this.boardRef) {
            const board = this.boardRef.nativeElement as HTMLElement;
            this.center.j = board.clientWidth / 2;
            this.center.i = board.clientHeight / 2;
        }
    }

    private drawTile(tile: Tile) {
        this.qwirkleService.drawTile(tile).subscribe({
            next: res => {
                this.gameState = res;
            }
        })
    }

    private getState() {
        this.qwirkleService.getState().subscribe({
            next: res => {
                this.gameState = res;

                this.getOpenPositions();

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            }
        });
    }

    private getValidMoves(tiles: Tile[]) {
        this.qwirkleService.getValidMoves(tiles).subscribe({
            next: res => {
                this.validMoves = res;
            }
        })
    }

    private getOpenPositions() {
        this.qwirkleService.getOpenPositions().subscribe({
            next: res => {
                this.openPositions = res;
            }
        })
    }

    createState() {
        this.qwirkleService.createState(this.hand).subscribe({
            next: res => {
                this.gameState = res;

                this.getOpenPositions();

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            }
        });
    }
}
