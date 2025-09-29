import {
    AfterViewInit,
    Component,
    ComponentRef,
    inject,
    Type,
    viewChild,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {ActivatedRoute} from "@angular/router";
import {DatePipe, Location, NgComponentOutlet, NgIf, NgTemplateOutlet} from "@angular/common";
import {CatanGameInfoComponent} from "../../sites/catan/game-info/game-info.component";
import {GameType} from "../../../dto/games/GameType";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {AuthService} from "../../../services/all/auth.service";
import {DeletePopupComponent} from "../delete-popup/delete-popup.component";
import {JollyGameComponent} from "../../sites/jolly/game/game.component";
import {JollyGameInfoComponent} from "../../sites/jolly/game-info/game-info.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {GameComponentRegistryService} from "../../../services/all/game-component-registry.service";

@Component({
    standalone: true,
    selector: 'game-info',
    imports: [
        NgIf,
        MainHeaderComponent,
        DurationPipe,
        DatePipe,
        DeletePopupComponent,
        NgTemplateOutlet,
        NgComponentOutlet
    ],
    templateUrl: './game-info.component.html',
    styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements AfterViewInit {
    protected authService = inject(AuthService);
    protected location = inject(Location);
    private route = inject(ActivatedRoute);
    private gameService = inject(GameService);
    private componentRegistry = inject(GameComponentRegistryService);

    protected deletePopup = viewChild.required<DeletePopupComponent>('deletePopup');

    protected game: GameDetails | null = null;

    get gameInfoComponent() {
        return this.game ? this.componentRegistry.getInfoComponent(this.game.metadata.gameType) : null;
    }

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

    private getGame(id: string) {
        this.gameService.getGame(id).subscribe(res => {
            this.game = res;
        });
    }
}
