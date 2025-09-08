import {AfterViewInit, Component, ComponentRef, inject, viewChild, ViewChild, ViewContainerRef} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {ActivatedRoute} from "@angular/router";
import {DatePipe, Location, NgIf} from "@angular/common";
import {CatanGameInfoComponent} from "../../sites/catan/game-info/game-info.component";
import {GameType} from "../../../dto/games/GameType";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {AuthService} from "../../../services/all/auth.service";
import {DeletePopupComponent} from "../delete-popup/delete-popup.component";

@Component({
    standalone: true,
    selector: 'game-info',
    imports: [
        NgIf,
        MainHeaderComponent,
        DurationPipe,
        DatePipe,
        DeletePopupComponent
    ],
    templateUrl: './game-info.component.html',
    styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements AfterViewInit {
    protected authService = inject(AuthService);
    protected location = inject(Location);
    private route = inject(ActivatedRoute);
    private gameService = inject(GameService);

    protected deletePopup = viewChild.required<DeletePopupComponent>('deletePopup');
    @ViewChild('content', {read: ViewContainerRef}) protected viewContainerRef!: ViewContainerRef;

    protected game: GameDetails | null = null;

    ngAfterViewInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.getGame(id);
        }
    }

    protected openDeletePopup() {
        this.deletePopup().openPopup();
    }

    protected deleteGame() {
        if(!this.game?.metadata) return;

        this.gameService.deleteGame(this.game?.metadata.id).subscribe(res => {
            this.location.back();
        });
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
