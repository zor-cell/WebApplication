import {Component, inject, input, model, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/all/auth.service";
import {GameStateBase} from "../../../dto/sites/GameStateBase";
import {GameConfigBase} from "../../../dto/sites/GameConfigBase";
import {GameSessionService} from "../../../services/sites/game-session.service";
import {ResultState} from "../../../dto/sites/catan/result/ResultState";
import {GameSessionSavePopupComponent} from "./popups/save-popup/save-popup.component";

@Component({
    selector: 'game-session-game',
    imports: [
        MainHeaderComponent,
        NgIf,
        GameSessionSavePopupComponent
    ],
    standalone: true,
    template: `
        <app-main-header>
            <button *ngIf="authService.isAdmin()" class="btn btn-primary" (click)="openSavePopup()">
                <i class="bi bi-floppy"></i>
            </button>
        </app-main-header>

        <ng-content></ng-content>

        <game-session-save-popup #savePopup
                                 *ngIf="gameState()"
                                 [teams]="gameState().gameConfig.teams"
                                 [showFileUpload]="showFileUpload()"
                                 [scores]="scores()"
                                 (saveSessionEvent)="saveSession($event)"
        />
    `
})
export class GameSessionGameComponent {
    protected savePopup = viewChild.required<GameSessionSavePopupComponent>('savePopup')

    public sessionService = input.required<GameSessionService<GameConfigBase, GameStateBase>>();
    public gameState = input.required<GameStateBase>();

    public showFileUpload = input<boolean>(true);
    public scores = input<Record<string, number>>();

    protected authService = inject(AuthService);

    openSavePopup() {
        this.savePopup().openPopup();
    }

    saveSession(event: {resultState: ResultState, imageFile: File | null}) {
        this.sessionService().saveSession(event.resultState, event.imageFile).subscribe({
            next: res => {

            }
        });
    }
}