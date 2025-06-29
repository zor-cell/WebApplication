import {Routes} from '@angular/router';
import {Connect4Component} from "./components/connect4/connect4.component";
import {ProjectsComponent} from "./components/projects/project-list/projects.component";
import {ProjectInfoComponent} from "./components/projects/project-info/project-info.component";
import {CatanGameComponent} from "./components/catan/game/game.component";
import {CatanConfigComponent} from "./components/catan/config/config.component";
import {QwirkleGameComponent} from "./components/qwirkle/game/game.component";

export const routes: Routes = [
    //project routing
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', component: ProjectsComponent},
    {path: 'projects/:name/info', component: ProjectInfoComponent},

    //connect4 routing
    {path: 'projects/connect4', component: Connect4Component},

    //catan routing
    {path: 'projects/catan', redirectTo: 'projects/catan/config', pathMatch: 'full'},
    {path: 'projects/catan/config', component: CatanConfigComponent},
    {path: 'projects/catan/game', component: CatanGameComponent},

    //qwirkle routing
    {path: 'projects/qwirkle', redirectTo: 'projects/qwirkle/game', pathMatch: 'full'},
    {path: 'projects/qwirkle/game', component: QwirkleGameComponent}
];
