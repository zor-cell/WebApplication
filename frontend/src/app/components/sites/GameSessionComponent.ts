import {GameSessionService} from "../../services/sites/game-session.service";
import {Directive, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {GameConfig} from "../../dto/sites/catan/game/GameConfig";

@Directive()
export abstract class GameSessionComponent<Config, State> implements OnInit {
    gameConfig!: Config;
    hasSession: boolean = false;
    originalConfig: Config | null = null;

    abstract clearPopup: {openPopup(): void}
    abstract updatePopup: {openPopup(): void}

    protected constructor(protected sessionService: GameSessionService<Config, State>,
                          protected projectName: string,
                          private router: Router) {}

    ngOnInit() {
        this.sessionService.getSession().subscribe(res => {
            this.hasSession = true;
            //TODO fix
            // @ts-ignore
            this.gameConfig = res.gameConfig;

            this.originalConfig = structuredClone(this.gameConfig);
        });
    }

    abstract isValidConfig() : boolean;

    startGame() {
        if(this.hasSession) return;

        this.sessionService.createSession(this.gameConfig).subscribe(res => {
           this.goToGame();
        });
    }

    continueGame() {
        if (!this.hasSession || this.originalConfig === null) return;

        //only show popup if changes to the config have been made
        if (this.configsAreEqual(this.gameConfig, this.originalConfig)) {
            this.goToGame();
        } else {
            this.openUpdatePopup();
        }
    }

    goToGame() {
        this.router.navigate([`projects/${this.projectName}/game`]);
    }

    openClearPopup() {
        this.clearPopup.openPopup();
    }

    openUpdatePopup() {
        this.updatePopup.openPopup();
    }

    private configsAreEqual(config1: Config, config2: Config): boolean {
        return JSON.stringify(config1) === JSON.stringify(config2);
    }
}