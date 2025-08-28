import {Routes} from '@angular/router';
import {Connect4Component} from "./components/sites/connect4/connect4.component";
import {ProjectListComponent} from "./components/projects/project-list/project-list.component";
import {ProjectInfoComponent} from "./components/projects/project-info/project-info.component";
import {CatanGameComponent} from "./components/sites/catan/game/game.component";
import {CatanConfigComponent} from "./components/sites/catan/config/config.component";
import {QwirkleGameComponent} from "./components/sites/qwirkle/game/game.component";
import {GameListComponent} from "./components/games/game-list/game-list.component";
import {GameInfoComponent} from "./components/games/game-info/game-info.component";
import {QwirkleConfigComponent} from "./components/sites/qwirkle/config/config.component";
import {JollyGameComponent} from "./components/sites/jolly/game/game.component";
import {JollyConfigComponent} from "./components/sites/jolly/config/config.component";

export const routes: Routes = [
    //project routing
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', component: ProjectListComponent},
    {path: 'projects/:name/info', component: ProjectInfoComponent},

    //game routing
    {path: 'games', component: GameListComponent},
    {path: 'games/:id', component: GameInfoComponent},

    //connect4 routing
    {path: 'projects/connect4', component: Connect4Component},

    //catan routing
    {path: 'projects/catan', redirectTo: 'projects/catan/config', pathMatch: 'full'},
    {path: 'projects/catan/config', component: CatanConfigComponent},
    {path: 'projects/catan/game', component: CatanGameComponent},

    //qwirkle routing
    {path: 'projects/qwirkle', redirectTo: 'projects/qwirkle/config', pathMatch: 'full'},
    {path: 'projects/qwirkle/config', component: QwirkleConfigComponent},
    {path: 'projects/qwirkle/game', component: QwirkleGameComponent},

    //jolly routing
    {path: 'projects/jolly', redirectTo: 'projects/jolly/config', pathMatch: 'full'},
    {path: 'projects/jolly/config', component: JollyConfigComponent},
    {path: 'projects/jolly/game', component: JollyGameComponent},
];
