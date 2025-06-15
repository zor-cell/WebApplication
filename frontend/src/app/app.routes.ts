import {Routes} from '@angular/router';
import {Connect4Component} from "./components/connect4/connect4.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {ProjectInfoComponent} from "./components/projects/project-info/project-info.component";
import {CatanGameComponent} from "./components/catan/game/game.component";
import {CatanConfigComponent} from "./components/catan/config/config.component";

export const routes: Routes = [
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', component: ProjectsComponent},
    {path: 'projects/:name/info', component: ProjectInfoComponent},
    {path: 'projects/connect4', component: Connect4Component},

    {path: 'projects/catan', redirectTo: 'projects/catan/config', pathMatch: 'full'},
    {path: 'projects/catan/config', component: CatanConfigComponent},
    {path: 'projects/catan/game', component: CatanGameComponent}
];
