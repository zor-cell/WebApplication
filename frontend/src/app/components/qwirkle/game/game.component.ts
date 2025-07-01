import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {Position} from "../../../dto/global/Position";
import {Move} from "../../../dto/qwirkle/Move";
import {Direction} from "../../../dto/qwirkle/Direction";
import {MoveGroup} from "../../../dto/qwirkle/MoveGroup";
import {ImageCacheService} from "../../../services/image-cache.service";
import {PanContainerComponent} from "../../global/pan-container/pan-container.component";

@Component({
    selector: 'qwirkle-game',
    imports: [
        QwirkleHandComponent,
        QwirkleStackComponent,
        MainHeaderComponent,
        NgIf,
        QwirkleTileComponent,
        NgForOf,
        NgStyle,
        PanContainerComponent
    ],
    templateUrl: './game.component.html',
    standalone: true,
    styleUrl: './game.component.css'
})
export class QwirkleGameComponent implements OnInit {
    @ViewChild('board') board!: PanContainerComponent;

    readonly center: Position = {
        x: 0,
        y: 0,
    };
    tileSize = 40;

    gameState: GameState | null = null;
    validMoves: MoveGroup[] = [];
    selectedMove: MoveGroup | null = null;

    constructor(private qwirkleService: QwirkleService) {
    }

    ngOnInit() {
        this.getState();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) : void {
        const target = event.target as HTMLElement;

        //unselect a move when clicking anywhere except on it
        if(!target.closest('.valid-move') && !target.closest('.highlighted-move')) {
            this.selectedMove = null;
        }
    }

    selectedInHand(tiles: Tile[]) {
        this.getValidMoves(tiles);
    }

    selectedInStack(tile: Tile) {
        if(!this.gameState || !this.gameState.hand || this.gameState?.hand?.length >= 6) return;

        this.drawTile(tile);
    }

    chooseValidMove(moveIndex: number) {
        this.selectedMove = this.validMoves[moveIndex];
    }

    makeSelectedMove(direction: Direction) {
        if(!this.selectedMove) return;

        const move: Move = {
            position: this.selectedMove.position,
            direction: direction,
            tiles: this.selectedMove.tiles
        }
        this.selectedMove = null;
        this.validMoves = [];

        this.makeMove(move);
    }

    getTilePositionStyle(position: Position) {
        return {
            left: `${this.center.x + position.x * this.tileSize - this.tileSize / 2}px`,
            bottom: `${this.center.y + position.y * this.tileSize - this.tileSize / 2}px`,
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

        for (const groupInfo of moveGroup.groupInfos) {
            const cssProp = borderMap[groupInfo.direction];
            if (cssProp) {
                style[cssProp] = `${borderWidth}px`;
            }
        }

        return style;
    }

    private calculateCenter() {
        if (this.board) {
            const board = this.board.elementRef.nativeElement as HTMLElement;
            this.center.x = board.clientWidth / 2;
            this.center.y = board.clientHeight / 2;
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

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            },
            error: err => {
                this.createState();
            }
        });
    }

    private makeMove(move: Move) {
        this.qwirkleService.makeMove(move).subscribe({
            next: res => {
                this.gameState = res;
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

    createState() {
        this.qwirkleService.createState([]).subscribe({
            next: res => {
                this.gameState = res;

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            }
        });
    }
}
