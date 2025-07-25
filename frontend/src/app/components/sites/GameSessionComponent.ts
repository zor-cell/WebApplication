import {GameSessionService} from "../../services/sites/game-session.service";
import {OnInit} from "@angular/core";
import {Router} from "@angular/router";

export abstract class GameSessionComponent<Config, State> implements OnInit {
    gameConfig!: Config;
    hasSession: boolean = false;
    originalConfig: Config | null = null;

    constructor(protected sessionService: GameSessionService<Config, State>, protected projectName: string, private router: Router) {

    }

    ngOnInit() {
        this.sessionService.getSession().subscribe(res => {
            this.hasSession = true;
            //TODO fix
            // @ts-ignore
            this.gameConfig = res.gameConfig;

            this.originalConfig = structuredClone(this.gameConfig);
        });
    }

    startGame() {
        if(this.hasSession) return;

        this.sessionService.createSession(this.gameConfig).subscribe(res => {
           this.goToGame();
        });
    }

    goToGame() {
        this.router.navigate([`projects/${this.projectName}/game`]);
    }
}