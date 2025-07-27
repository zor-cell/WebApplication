import {Component, inject, input, model, OnInit, output, signal, viewChild} from "@angular/core";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {CatanClearPopupComponent} from "../catan/popups/clear-popup/clear-popup.component";
import {CatanUpdatePopupComponent} from "../catan/popups/update-popup/update-popup.component";
import {GameConfig} from "../../../dto/sites/catan/game/GameConfig";
import {GameSessionService} from "../../../services/sites/game-session.service";
import {Router} from "@angular/router";
import {GameSessionClearPopupComponent} from "./clear-popup/clear-popup.component";
import {GameSessionUpdatePopupComponent} from "./update-popup/update-popup.component";

@Component({
    selector: 'game-session-base',
    imports: [
        MainHeaderComponent,
        CatanClearPopupComponent,
        CatanUpdatePopupComponent,
        GameSessionClearPopupComponent,
        GameSessionUpdatePopupComponent
    ],
    template: `
        <app-main-header>
            @if (!hasSession()) {
                <button class="btn btn-primary" (click)="startGame()" [disabled]="!isValidConfig()">
                    <i class="bi bi-play-circle"></i>
                </button>
            } @else {
                <button class="btn btn-outline-danger" (click)="openClearPopup()">
                    <i class="bi bi-database-fill-x"></i>
                </button>
                <button class="btn btn-outline-primary" (click)="continueGame()">
                    <i class="bi bi-play-circle"></i>
                </button>
            }
        </app-main-header>

        <ng-content></ng-content>

        <game-session-clear-popup #clearPopup (clearSessionEvent)="clearSession()"></game-session-clear-popup>
        <game-session-update-popup #updatePopup [canUpdate]="isValidConfig()"
                                   (updateSessionEvent)="updateSession($event)"></game-session-update-popup>
    `
})
export class GameSessionComponent<Config extends GameConfig> implements OnInit {
    private clearPopup = viewChild.required<CatanClearPopupComponent>('clearPopup');
    private updatePopup = viewChild.required<CatanUpdatePopupComponent>('updatePopup');

    sessionService = input.required<GameSessionService<Config, any>>();
    projectName = input.required<string>();
    isValidConfig = input.required<boolean>();
    gameConfig = model.required<Config>();

    protected hasSession = signal<boolean>(false);
    private originalConfig: Config | null = null;

    private router = inject(Router);

    ngOnInit() {
        this.sessionService().getSession().subscribe(res => {
            this.hasSession.set(true);
            //TODO fix
            // @ts-ignore
            this.gameConfig.set(res.gameConfig);

            this.originalConfig = structuredClone(this.gameConfig());
        });
    }

    startGame() {
        if(this.hasSession()) return;

        this.sessionService().createSession(this.gameConfig()).subscribe(res => {
            this.goToGame();
        });
    }

    continueGame() {
        if (!this.hasSession || this.originalConfig === null) return;

        //only show popup if changes to the config have been made
        if (this.configsAreEqual(this.gameConfig(), this.originalConfig)) {
            this.goToGame();
        } else {
            this.openUpdatePopup();
        }
    }

    goToGame() {
        this.router.navigate([`projects/${this.projectName()}/game`]);
    }

    openClearPopup() {
        this.clearPopup().openPopup();
    }

    openUpdatePopup() {
        this.updatePopup().openPopup();
    }

    protected clearSession() {
        this.sessionService().clearSession().subscribe({
            next: res => {
                this.hasSession.set(false);
            }
        });
    }

    protected updateSession(submit: boolean) {
        if(submit) {
            this.sessionService().updateSession(this.gameConfig()).subscribe({
                next: res => {
                    this.goToGame();
                }
            });
        } else {
            this.goToGame();
        }
    }

    private configsAreEqual(config1: Config, config2: Config): boolean {
        return JSON.stringify(config1) === JSON.stringify(config2);
    }
}