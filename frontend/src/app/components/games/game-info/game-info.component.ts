import {AfterViewInit, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {CatanGameInfoComponent} from "../../sites/catan/game-info/game-info.component";
import {GameType} from "../../../dto/games/GameType";

@Component({
    standalone: true,
    selector: 'game-info',
    imports: [
        NgIf
    ],
    templateUrl: './game-info.component.html',
    styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements OnInit, AfterViewInit {
    @ViewChild('content', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;
    game: GameDetails | null = null;

    constructor(private route: ActivatedRoute, private gameService: GameService) {
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.getGame(id);
        }
    }

    private loadGameSpecificComponent() {
        if(this.viewContainerRef) this.viewContainerRef.clear();

        type componentTypes = CatanGameInfoComponent;

        let component: any;
        switch (this.game?.metadata.gameType) {
            case GameType.CATAN:
                component = CatanGameInfoComponent;
                break;
            default:
                return;
        }

        const componentRef: ComponentRef<componentTypes> = this.viewContainerRef.createComponent(component);
        componentRef.instance.metadata = this.game?.metadata;
        componentRef.instance.gameState = this.game?.gameState;
        componentRef.instance.resultState = this.game?.result;
    }

    private getGame(id: string) {
        this.gameService.getGame(id).subscribe(res => {
            this.game = res;
            this.loadGameSpecificComponent();
        });
    }
}
