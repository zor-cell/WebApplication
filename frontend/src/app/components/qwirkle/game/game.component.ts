import {Component, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {QwirkleHandComponent} from "../hand/hand.component";
import {QwirkleStackComponent} from "../stack/stack.component";
import {MainHeaderComponent} from "../../global/main-header/main-header.component";
import {QwirkleService} from "../../../services/qwirkle.service";
import {GameState} from "../../../dto/qwirkle/GameState";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {Tile} from "../../../dto/qwirkle/Tile";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Position} from "../../../dto/global/Position";
import {Move} from "../../../dto/qwirkle/Move";
import {Direction} from "../../../dto/qwirkle/Direction";
import {MoveGroup} from "../../../dto/qwirkle/MoveGroup";
import {PanContainerComponent} from "../../global/pan-container/pan-container.component";
import {HandInfo} from "../../../dto/qwirkle/HandInfo";

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

    tileSize = 40;
    gameState: GameState | null = null;
    validMoves: MoveGroup[] = [];
    selectedMove: MoveGroup | null = null;
    bestMoves: MoveGroup[] | null = null;

    handInfo: HandInfo[] = [];

    private readonly localCenter: Position = {
        x: 0,
        y: 0,
    };

    get center() {
        return {
            x: this.localCenter.x - this.tileSize / 2,
            y: this.localCenter.y - this.tileSize / 2
        }
    }

    constructor(private qwirkleService: QwirkleService) {
    }

    ngOnInit() {
        this.getState();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        //unselect a move when clicking anywhere except on it
        if (!target.closest('.valid-move') && !target.closest('.highlighted-move')) {
            this.selectedMove = null;
        }
    }

    //events from children
    clearedHand() {
        this.clearHand();
    }

    selectedInHand(tiles: Tile[]) {
        this.validateHand(tiles);
        this.getValidMoves(tiles);
    }

    selectedInStack(tile: Tile) {
        if (!this.gameState || !this.gameState.hand || this.gameState?.hand?.length >= 6) return;

        this.drawTile(tile);
    }

    //events from board
    chooseValidMove(moveIndex: number) {
        this.selectedMove = this.validMoves[moveIndex];
    }

    makeBestMove(moveIndex: number) {
        if(!this.bestMoves) return;

        const moveGroup = this.bestMoves[moveIndex];

        const move: Move = {
            position: moveGroup.position,
            direction: moveGroup.groupInfos[0].direction,
            tiles: moveGroup.tiles
        };

        this.makeMove(move);
    }

    makeSelectedMove(direction: Direction) {
        if (!this.selectedMove) return;

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
            left: `${position.x * this.tileSize - this.tileSize / 2}px`,
            bottom: `${position.y * this.tileSize - this.tileSize / 2}px`,
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
        if (moveGroup.tiles.length === 1) {
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
            this.localCenter.x = board.clientWidth / 2;
            this.localCenter.y = board.clientHeight / 2;
        }
    }


    //requests
    private validateHand(tiles: Tile[]) {
        this.qwirkleService.validateHand(tiles).subscribe({
            next: res => {
                this.handInfo = res;
            }
        })
    }

    private findBestMoves() {
        this.qwirkleService.getBestMoves().subscribe({
            next: res => {
                this.bestMoves = res;
            }
        })
    }

    private drawTile(tile: Tile) {
        this.qwirkleService.drawTile(tile).subscribe({
            next: res => {
                this.gameState = res;

                this.findBestMoves();
            }
        })
    }

    private clearHand() {
        this.qwirkleService.clearHand().subscribe({
            next: res => {
                this.gameState = res;

                this.bestMoves = null;
            }
        })
    }

    private getState() {
        this.qwirkleService.getState().subscribe({
            next: res => {
                this.gameState = res;

                this.findBestMoves();

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

                this.findBestMoves();
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

    private createState() {
        this.qwirkleService.createState([]).subscribe({
            next: res => {
                this.gameState = res;

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            }
        });
    }
}
